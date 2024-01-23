use crate::hydra_iterator::HydraInput;
use anyhow::Context;
use log::trace;
use messages::mavlink;
use messages::mavlink::uorocketry;
use messages::Message;
use postcard::from_bytes;
use serialport::available_ports;

pub fn process_serial(
    port: &Option<String>,
    baud_rate: u32,
) -> Box<dyn Iterator<Item = HydraInput> + Send> {
    let port = if let Some(port) = port {
        port.clone()
    } else {
        available_ports()
            .context("No serial port specified and couldn't retrieve available ports")
            .unwrap()
            .iter()
            .filter(|x| x.port_name.contains("USB"))
            .last()
            .context("No serial port specified and couldn't find any port")
            .unwrap()
            .port_name
            .clone()
    };
    let link = mavlink::connect::<uorocketry::MavMessage>(
        format!("serial:{}:{}", port, baud_rate).as_str(),
    )
    .unwrap();

    let (_, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) = link.recv().unwrap();

    struct IteratorObj {
        recv_msg: uorocketry::MavMessage,
    }

    impl Iterator for IteratorObj {
        type Item = HydraInput;

        fn next(&mut self) -> Option<Self::Item> {
            let msg = match &self.recv_msg {
                uorocketry::MavMessage::POSTCARD_MESSAGE(data) => {
                    let msg: Message = from_bytes(data.message.as_slice()).unwrap();
                    trace!("Received rocket message: {:#?}", msg);
                    HydraInput::RocketData(msg)
                }
                uorocketry::MavMessage::RADIO_STATUS(data) => {
                    trace!("Received radio status: {:?}", data);
                    HydraInput::MavlinkRadioStatus(data.clone())
                }
                uorocketry::MavMessage::HEARTBEAT(heartbeat) => {
                    trace!("Received heartbeat");
                    HydraInput::MavlinkHeartbeat(heartbeat.clone())
                }
            };

            return Some(msg);
        }
    }

    return Box::from(IteratorObj {
        recv_msg: recv_msg.clone(),
    });
}
