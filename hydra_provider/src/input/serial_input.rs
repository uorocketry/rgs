use crate::processing::InputData;
use anyhow::Context;
use anyhow::Ok;
use anyhow::Result;
use log::{error, trace};

use messages::mavlink;
use messages::mavlink::uorocketry;
use messages::mavlink::MavConnection;
use messages::Message;
use postcard::from_bytes;
use serialport::available_ports;
use std::path::Path;
use std::sync::mpsc::Sender;

use std::fs::read;

use std::thread;
use std::time::Duration;

pub struct SerialInput {
    link: Box<dyn MavConnection<uorocketry::MavMessage> + Send + Sync>,
}

impl SerialInput {
    /// Creates a new SerialInput
    /// If port is not specified then it selects a USB port! This assumes we do not chose the wrong port.
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
                if let Err(e) = self.read_sdcard() {
                    error!("Error reading sdcard: {:?}", e)
                }
            });
        });

        // To satisfy that we never return.
        panic!("Serial threads ended!");
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

    fn read_sdcard(&self) {
        let path = Path::new("../data/sdcard.txt");
        let data = read(path);

        let msg = from_bytes(data);

        // send.send
    }
}
