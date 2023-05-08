use crate::input::HydraInput;
use anyhow::Context;
use anyhow::Result;
use log::{error, info};
use mavlink;
use mavlink::uorocketry;
use mavlink::MavConnection;
use messages::Message;
use postcard::from_bytes;
use serialport::available_ports;
use std::sync::mpsc::Sender;

pub struct SerialInput {
    reader: Box<dyn MavConnection<uorocketry::MavMessage>>,
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
        let config = format!("serial:{}:{}", port, baud_rate.to_string());
        let link = mavlink::connect::<uorocketry::MavMessage>(config.as_str())?;

        Ok(SerialInput { reader: link })
    }
}

impl HydraInput for SerialInput {
    fn read_loop(&mut self, send: Sender<Message>) -> ! {
        loop {
            match self.read_message() {
                Ok(msg) => {
                    send.send(msg).expect("Failed to send message");
                }
                Err(e) => {
                    error!("Error reading message: {:?}", e);
                }
            }
        }
    }
}

impl SerialInput {
    fn read_message(&mut self) -> Result<Message> {
        let (_header, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) =
            self.reader.recv()?;

        match recv_msg {
            uorocketry::MavMessage::POSTCARD_MESSAGE(data) => {
                let msg: Message = from_bytes(data.message.as_slice())?;
                info!("received: {:#?}", msg);
                Ok(msg)
            }
            _ => Err(anyhow::anyhow!("error: {:#?}", "wrong message type")),
        }
    }
}
