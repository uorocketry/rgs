use crate::processing::InputData;
use anyhow::Context;
use anyhow::Ok;
use anyhow::Result;
use log::{error, trace};

use messages::command::Command;
use messages::command::CommandData;
use messages::command::DeployDrogue;
use messages::command::DeployMain;
use messages::mavlink;
use messages::mavlink::uorocketry;
use messages::mavlink::uorocketry::MavMessage;
use messages::mavlink::uorocketry::POSTCARD_MESSAGE_DATA;
use messages::mavlink::MavConnection;
use messages::sender;
use messages::Data;
use messages::Message;
use postcard::from_bytes;
use postcard::to_vec;
use serialport::available_ports;
use std::sync::mpsc::Sender;

use std::thread;
use std::time::Duration;
use std::time::SystemTime;

pub struct SerialInput {
    link: Box<dyn MavConnection<uorocketry::MavMessage> + Send + Sync>,
}

impl SerialInput {
    pub fn new(port: &Option<String>, baud_rate: u32) -> Result<Self> {
        let port = if let Some(port) = port {
            port.clone()
        } else {
            available_ports()
                .context("No serial port specified and couldn't retrieve available ports")?
                .iter()
                .filter(|x| x.port_name.contains("USB"))
                .last()
                .context("No serial port specified and couldn't find any port")?
                .port_name
                .clone()
        };
        let config = format!("serial:{}:{}", port, baud_rate);
        let link = mavlink::connect::<uorocketry::MavMessage>(config.as_str())?;

        Ok(SerialInput { link })
    }
}

impl SerialInput {
    pub fn read_write_loop(&self, send: Sender<InputData>) -> ! {
        thread::scope(|s| {
            // Reading thread
            s.spawn(move || loop {
                if let Err(e) = self.read_message(&send) {
                    error!("Error reading message: {:?}", e);
                }
            });

            // Writing (heartbeat) thread
            s.spawn(|| loop {
                if let Err(e) = self.send_heartbeat() {
                    error!("Error sending heartbeat: {:?}", e);
                }
                thread::sleep(Duration::from_secs(1));
            });

            s.spawn(|| loop {
                let mut input = String::new();
                std::io::stdin()
                    .read_line(&mut input)
                    .expect("No string inputted");

                let cmd: CommandData;

                if input.contains("Fire dr") {
                    cmd = CommandData::DeployDrogue(DeployDrogue { val: true });
                    println!("Drogue deployed");
                } else if input.contains("Fire main") {
                    cmd = CommandData::DeployMain(DeployMain { val: true });
                    println!("Main deployed");
                } else {
                    println!("Invalid command");
                    continue;
                }

                let data = Data::Command(Command { data: cmd });
                let time = fugit::Instant::<u64, 1, 1000>::from_ticks(
                    SystemTime::now()
                        .duration_since(SystemTime::UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as u64,
                );
                let sender = sender::Sender::GroundStation;
                let msg = Message::new(&time, sender, data);
                if let Err(e) = self.send_message(msg) {
                    error!("Error sending message: {:?}", e);
                }
            });
        });

        // To satisfy that we never return.
        panic!("Serial threads ended!");
    }

    fn send_message(&self, msg: Message) -> Result<()> {
        let postcard_bytes = to_vec(&msg).expect("Failed to serialize message");
        let postcard_data = POSTCARD_MESSAGE_DATA {
            message: postcard_bytes,
        };
        let data = MavMessage::POSTCARD_MESSAGE(postcard_data);
        println!("Sending message: {:?}", msg);

        let header = mavlink::MavHeader {
            system_id: 0,
            component_id: 0,
            sequence: 0,
        };

        // FIX: Message doesn't get sent it gets stuck here for some reason
        self.link.send(&header, &data).unwrap();
        println!("Sent message");
        Ok(())
    }

    fn send_heartbeat(&self) -> Result<()> {
        let msg = uorocketry::HEARTBEAT_DATA {
            custom_mode: 0,
            mavtype: 0,
            autopilot: 0,
            base_mode: 0,
            system_status: 0,
            mavlink_version: 2,
        };

        let header = mavlink::MavHeader {
            system_id: 0,
            component_id: 0,
            sequence: 0,
        };

        self.link
            .send(&header, &uorocketry::MavMessage::HEARTBEAT(msg))?;

        trace!("Sent heartbeat");
        Ok(())
    }

    fn read_message(&self, send: &Sender<InputData>) -> Result<()> {
        let (header, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) = self.link.recv()?;

        let msg = match recv_msg {
            uorocketry::MavMessage::POSTCARD_MESSAGE(data) => {
                // Only send header if this is data from the rocket
                send.send(InputData::MavlinkHeader(header)).unwrap();

                let msg: Message = from_bytes(data.message.as_slice())?;
                trace!("Received rocket message: {:#?}", msg);
                InputData::RocketData(msg)
            }
            uorocketry::MavMessage::RADIO_STATUS(data) => {
                trace!("Received radio status: {:?}", data);
                InputData::MavlinkRadioStatus(data)
            }
            uorocketry::MavMessage::HEARTBEAT(_) => {
                trace!("Received heartbeat");
                InputData::MavlinkHeartbeat()
            }
        };

        send.send(msg).unwrap();

        Ok(())
    }
}
