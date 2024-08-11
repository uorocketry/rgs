use std::io::{self, Read, Write};
use std::net::TcpStream;
use std::os::linux::raw;

use mavlink::connect;
use mavlink::error::MessageReadError;
use mavlink::uorocketry::MavMessage;
use messages::Message;
use postcard::{from_bytes, to_slice, to_slice_cobs};

fn main() -> io::Result<()> {
    let connection = connect::<MavMessage>("tcpout:127.0.0.1:5656").unwrap();
    let mut raw_connection = TcpStream::connect("127.0.0.1:5656").unwrap();
    // Print pointer to connection
    println!("Connected");
    let deploy_cmd = messages::command::RadioRateChange {
        rate: messages::command::RadioRate::Slow,
    };
    let mut command: [u8; 15] = [0; 15];
    to_slice(&deploy_cmd, &mut command).unwrap();

    let send_msg =
        MavMessage::COMMAND_MESSAGE(mavlink::uorocketry::COMMAND_MESSAGE_DATA { command: command });

    let header = mavlink::MavHeader {
        system_id: 10,
        component_id: 10,
        sequence: 10,
    };

    loop {
        // raw_connection.write(b"test").unwrap();
        connection.send(&header, &send_msg).unwrap();
        // sleep a 100ms
        std::thread::sleep(std::time::Duration::from_millis(100));
    }

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
