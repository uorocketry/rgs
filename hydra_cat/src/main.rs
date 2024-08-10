use std::io::{self, Read};
use std::net::TcpStream;

use mavlink::connect;
use mavlink::error::MessageReadError;
use mavlink::uorocketry::MavMessage;
use messages::Message;
use postcard::{from_bytes, to_slice_cobs};

fn main() -> io::Result<()> {
    let connection = connect::<MavMessage>("tcpout:127.0.0.1:5656").unwrap();
    // Print pointer to connection
    println!("Connected");
    let deploy_cmd = messages::command::DeployDrogue { val: true };
    let mut command: [u8; 15] = [0; 15];
    to_slice_cobs(&deploy_cmd, &mut command).unwrap();

    let send_msg =
        MavMessage::COMMAND_MESSAGE(mavlink::uorocketry::COMMAND_MESSAGE_DATA { command: command });

    let header = mavlink::MavHeader {
        system_id: 1,
        component_id: 1,
        sequence: 0,
    };

    connection.send(&header, &send_msg).unwrap();

    println!("Sent message");

    loop {
        match connection.recv() {
            Ok((header, msg)) => {
                // Use serde to convert msg to JSON

                let msg_json = serde_json::to_string(&msg).unwrap();
                let header_json = serde_json::to_string(&header).unwrap();
                // println!("Header: {}", header_json);
                // println!("Message: {}", msg_json);

                let message = match &msg {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        // println!("Received postcard message: {:?}", data);
                        let data: Message = from_bytes(data.message.as_slice()).unwrap();
                        println!("Received rocket message: {:#?}", data);
                        // HydraInput::Message(data)
                    }
                    MavMessage::RADIO_STATUS(data) => {
                        println!("Received radio status: {:?}", data);
                        // info!("Received radio status: {:?}", data);
                        // HydraInput::RadioStatus(data.clone())
                    }
                    MavMessage::HEARTBEAT(heartbeat) => {
                        println!("Received heartbeat: {:?}", heartbeat);
                        // info!("Received heartbeat.");
                        // HydraInput::Heartbeat(heartbeat.clone())
                    }
                    MavMessage::LOG_MESSAGE(data) => {
                        println!("Received log message: {:?}", data);
                        // info!("Received log message: {:?}", data);
                        // HydraInput::LogMessage(data.clone())
                    }
                    MavMessage::HEALTH_MESSAGE(data) => {
                        println!("Received unknown message: {:?}", data);
                        // info!("Received unknown message: {:?}", data);
                        // HydraInput::Unknown(data.clone())
                    }
                    // command_message state_message sensor_message
                    MavMessage::COMMAND_MESSAGE(data) => {
                        println!("Received command message: {:?}", data);
                        // info!("Received command message: {:?}", data);
                        // HydraInput::CommandMessage(data.clone())
                    }
                    MavMessage::STATE_MESSAGE(data) => {
                        println!("Received state message: {:?}", data);
                        // info!("Received state message: {:?}", data);
                        // HydraInput::StateMessage(data.clone())
                    }
                    MavMessage::SENSOR_MESSAGE(data) => {
                        println!("Received sensor message: {:?}", data);
                        // info!("Received sensor message: {:?}", data);
                        // HydraInput::SensorMessage(data.clone())
                    }
                };
            }
            // Ignore wouldblock messages
            Err(MessageReadError::Io(e)) if e.kind() == io::ErrorKind::WouldBlock => {}
            Err(e) => {
                // Print pointer to e
                println!("Error: {:?}", e);
            }
        }
    }

    Ok(())
}
