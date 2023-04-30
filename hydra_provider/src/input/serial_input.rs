use crate::input::HydraInput;
use anyhow::Context;
use anyhow::Result;
use log::info;
use mavlink::uorocketry;
use messages::Message;
use postcard::from_bytes;
use serialport::available_ports;
use std::io::{BufRead, BufReader};
use std::time::Duration;
use mavlink;

pub struct SerialInput {
    reader: Box<dyn BufRead>,
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

        info!("Using serial port '{port}'");

        let port = serialport::new(&port, baud_rate)
            .timeout(Duration::new(30, 0))
            .open()
            .with_context(|| format!("Failed to open serial connection '{port}'"))?;

        let f = BufReader::new(port);

        Ok(SerialInput {
            reader: Box::new(f),
        })
    }
}

impl HydraInput for SerialInput {
    fn read_message(&mut self) -> Result<Message> {
 
        let mut data = vec![];
        self.reader.read_until(0xfe, &mut data)?;
        let (_header, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) = mavlink::read_v2_msg(&mut data.as_slice())?;

        match recv_msg {
            uorocketry::MavMessage::POSTCARD_MESSAGE(data) => {
                let msg: Message = from_bytes(data.message.as_slice())?;
                info!("received: {:#?}", msg);
                return Ok(msg);
            }
            _ => {
                return Err(anyhow::anyhow!("error: {:#?}", "wrong message type"));
            }
        }
    }
}
