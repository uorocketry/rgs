use log::info;
use mavlink::error::MessageReadError;
use messages::mavlink::MavConnection;
use postcard::from_bytes;
use core::panic;
use std::io;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use tokio::sync::Mutex;
use mavlink::{connect};


use crate::hydra_input::HydraInput;
use messages::Message;

use messages::mavlink::uorocketry::MavMessage;

#[derive(Clone)]
pub struct SerialDataFeedIterator {
    pub mavlink: Arc<Mutex<Option<Box<dyn MavConnection<MavMessage> + Send + Sync>>>>,
    pub is_running: Arc<AtomicBool>,
}

impl SerialDataFeedIterator {
    pub async fn next(&mut self) -> Option<HydraInput> {
        let mavlink_option = self.mavlink.lock().await;
        if mavlink_option.is_none() {
            return None;
        }
        let mavlink = mavlink_option.as_ref().unwrap();
        // let (_, mavlink_message) = mavlink.recv().unwrap();
        // let message = match &mavlink_message {
        //     MavMessage::POSTCARD_MESSAGE(data) => {
        //         let data: Message = from_bytes(data.message.as_slice());
        //         info!("Received rocket message: {:#?}", data);
        //         HydraInput::Message(data)
        //     }
        //     MavMessage::RADIO_STATUS(data) => {
        //         info!("Received radio status: {:?}", data);
        //         HydraInput::RadioStatus(data.clone())
        //     }
        //     MavMessage::HEARTBEAT(heartbeat) => {
        //         info!("Received heartbeat.");
        //         HydraInput::Heartbeat(heartbeat.clone())
        //     }
        //     MavMessage::SENSOR_MESSAGE(_) => {
        //         println!("bad msg");
        //         return None;
        //     },
        //     MavMessage::COMMAND_MESSAGE(_) => {
        //         println!("bad msg");
        //         return None;
        //     }, 
        //     MavMessage::STATE_MESSAGE(_) => {
        //         println!("bad msg");
        //         return None;
        //     },
        //     MavMessage::LOG_MESSAGE(_) => {
        //         println!("bad msg");
        //         return None;
        //     },
        //     MavMessage::HEALTH_MESSAGE(_) => {
        //         println!("bad msg");
        //         return None;
        //     },
            
        // };
        match mavlink.recv() {
            Ok((header, msg)) => {
                // Use serde to convert msg to JSON

                // let msg_json = serde_json::to_string(&msg).unwrap();
                // let header_json = serde_json::to_string(&header).unwrap();
                // println!("Header: {}", header_json);
                // println!("Message: {}", msg_json);

                let message = match &msg {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        // println!("Received postcard message: {:?}", data);
                        let data: Message = from_bytes(data.message.as_slice()).unwrap();
                        let msg_json = serde_json::to_string(&data).unwrap();
                        println!("Received rocket message: {:#?}", data);
                        HydraInput::Message(data)
                    }
                    MavMessage::RADIO_STATUS(data) => {
                        println!("Received radio status: {:?}", data);
                        // info!("Received radio status: {:?}", data);
                        HydraInput::RadioStatus(data.clone())
                    }
                    MavMessage::HEARTBEAT(heartbeat) => {
                        println!("Received heartbeat: {:?}", heartbeat);
                        // info!("Received heartbeat.");
                        HydraInput::Heartbeat(heartbeat.clone())
                    }
                    MavMessage::LOG_MESSAGE(data) => {
                        println!("Received log message: {:?}", data);
                        // info!("Received log message: {:?}", data);
                        panic!("fml");

                        // HydraInput::LogMessage(data.clone())
                    }
                    MavMessage::HEALTH_MESSAGE(data) => {
                        println!("Received unknown message: {:?}", data);
                        // info!("Received unknown message: {:?}", data);
                        // HydraInput::Unknown(data.clone())
                        panic!("fml");
                    }
                    // command_message state_message sensor_message
                    MavMessage::COMMAND_MESSAGE(data) => {
                        println!("Received command message: {:?}", data);
                        // info!("Received command message: {:?}", data);
                        panic!("fml");
                        // HydraInput::CommandMessage(data.clone())
                    }
                    MavMessage::STATE_MESSAGE(data) => {
                        println!("Received state message: {:?}", data);
                        panic!("fml");
                        // info!("Received state message: {:?}", data);
                        // HydraInput::(data.clone())
                    }
                    MavMessage::SENSOR_MESSAGE(data) => {
                        println!("Received sensor message: {:?}", data);
                        // info!("Received sensor message: {:?}", data);
                        // HydraInput::SensorMessage(data.clone())
                        panic!("fml");
                    }
                };
                return Some(message);
            }
            // Ignore wouldblock messages
            Err(MessageReadError::Io(e)) if e.kind() == io::ErrorKind::WouldBlock => {
                return None;
            }
            Err(e) => {
                // Print pointer to e
                println!("Error: {:?}", e);
                return None;
            }
        }
    }
}
