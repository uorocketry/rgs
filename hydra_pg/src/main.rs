use std::hash::RandomState;
use std::io::{self, Read, Write};
use std::net::{TcpListener, TcpStream};
use std::os::linux::raw;
use std::sync::{Arc, Mutex};

use mavlink::error::MessageReadError;
use mavlink::uorocketry::MavMessage;
use mavlink::{connect, write_v2_msg, MAVLinkV2MessageRaw};
use messages::sensor::{GpsPos1, GpsPos2};
use messages::Message;
use postcard::ser_flavors::Slice;
use postcard::{from_bytes, to_slice, to_slice_cobs};
use rand::Rng;
use serde::Serialize;

// struct with lat lon alt
#[derive(serde::Serialize)]
struct Location {
    lat: f64,
    lon: f64,
    alt: f64,
    t: f64,
}

fn main() -> io::Result<()> {
    // let mut raw_connection = TcpStream::connect("127.0.0.1:5656").unwrap();

    // Cretae a TCP server at 5757
    let listener = TcpListener::bind("0.0.0.0:5757").unwrap();

    let connection = connect::<MavMessage>("tcpout:127.0.0.1:5656").unwrap();

    // On a separate thread, accept clients and send hello message

    // change location by 0.1 randomly every 200ms in a thread

    let handle = std::thread::spawn(move || loop {
        let (stream, _) = listener.accept().unwrap();
        println!("Got a connection");
        let mut stream = stream;
        std::thread::spawn(move || {
            let mut n = 0;

            let connection_start_timestamp = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs_f64();
            // altitude formula
            // ascending: y = -0,4865x4 + 2,2838x3 + 2,3335x2 + 66,248x - 2,2112
            // descending: y = 2E-05x4 - 0,0058x3 + 0,5569x2 - 21,807x + 455,44
            // ascending: [0, 5.64 seconds]
            // descending: [5.64, 120 seconds]
            // -1 otherwise

            loop {
                // timestamp as unix epoch
                let timestamp = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_secs_f64();
                let time_since_start = timestamp - connection_start_timestamp;

                // let altitude_formula = |x: f64| {
                //     if x < 5.64 && x > 0.0 {
                //         return -0.4865 * x.powi(4)
                //             + 2.2838 * x.powi(3)
                //             + 2.3335 * x.powi(2)
                //             + 66.248 * x
                //             - 2.2112;
                //     } else if x >= 5.64 && x < 120.0 {
                //         return 2E-05 * x.powi(4) - 0.0058 * x.powi(3) + 0.5569 * x.powi(2)
                //             - 21.807 * x
                //             + 455.44;
                //     } else {
                //         -1.0
                //     }
                // };

                let altitude_range = 1400.0; // In meters
                let altitude_formula = |x: f64| altitude_range + altitude_range * (x).sin();

                let location_obj = Location {
                    alt: 1000.0,
                    lat: 45.42463,
                    lon: -75.68683 + time_since_start.sin() * 0.1,
                    t: timestamp,
                };

                let location_json = serde_json::to_string(&location_obj).unwrap() + "\n";

                n += 1;
                stream.write_all(location_json.as_bytes()).unwrap();
                stream.flush().unwrap();
                // stream.write_all(hello.as_bytes()).unwrap();
                println!("Sent: {}", location_json);
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
        });
    });

    // println!("Connected");
    // let deploy_cmd = messages::Message::new(
    //     0,
    //     messages::sender::Sender::GroundStation,
    //     messages::command::Command::new(messages::command::DeployDrogue { val: true }),
    // );
    // let mut buf = [0u8; 255];

    // postcard::to_slice(&deploy_cmd, &mut buf).unwrap();
    // let send_msg =
    //     MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA { message: buf });

    // let header = mavlink::MavHeader {
    //     system_id: 10,
    //     component_id: 10,
    //     sequence: 10,
    // };

    // let mut message_raw = MAVLinkV2MessageRaw::new();
    // message_raw.serialize_message(header, &send_msg);

    // loop {
    //     // raw_connection.write_all(&message_raw.raw_bytes())?;
    //     connection.send(&header, &send_msg).unwrap();
    //     // sleep a 100ms
    //     std::thread::sleep(std::time::Duration::from_millis(100));
    // }

    loop {
        match connection.recv() {
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
                    }
                    MavMessage::LOG_MESSAGE(data) => {
                        let data = String::from_utf8_lossy(&data.log);
                        println!("Received log message: {:?}", data);
                    }
                    MavMessage::RADIO_STATUS(data) => {
                        // println!("Received radio status message: {:?}", data);
                    }
                    _ => {
                        println!("Received unknown message of type: {:?}", msg);
                        panic!("???")
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
