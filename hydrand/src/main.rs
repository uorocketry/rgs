mod random_message;

use clap::Parser;
use messages::mavlink::{self, MAVLinkV2MessageRaw};
use std::io::Write;
use std::net::{TcpListener, TcpStream};
use tracing::{error, info};
use tracing_subscriber;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,

    // sleep time in ms
    #[arg(short, long, default_value_t = 100)]
    interval: u64,
}

fn handle_connection(stream: &mut TcpStream, interval: u64) {
    let peer_addr = match stream.peer_addr() {
        Ok(addr) => addr.to_string(),
        Err(e) => {
            error!("Failed to get peer address, not accepting: {:?}", e);
            String::from("Unknown")
        }
    };
    let mut i = 0;
    loop {
        let message = random_message::random_message();
        let mut message_raw = MAVLinkV2MessageRaw::new();
        message_raw.serialize_message(
            mavlink::MavHeader {
                system_id: 0,
                component_id: 0,
                sequence: i,
            },
            &message,
        );
        i = i.wrapping_add(1);
        println!("Sending message {}", i);
        // i = i.wrapping_add_signed(1);

        // if rand::random::<u8>() > 144 {
        //     i = i.wrapping_add_signed(1);
        // }

        if let Err(e) = stream.write_all(&message_raw.raw_bytes()) {
            error!(
                "Failed to send message to client {:?}. REASON: {:?}",
                peer_addr, e
            );
            break;
        }
        std::thread::sleep(std::time::Duration::from_millis(interval));
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::TRACE)
        .init();

    let args = Args::parse();

    info!("Attempting to bindto {}:{}", args.address, args.port);
    let listener = match TcpListener::bind("127.0.0.1:5656") {
        Ok(listener) => {
            info!("Server created successfully");
            listener
        }
        Err(error) => {
            error!("Failed to connect: {}", error);
            return Err(error.into());
        }
    };

    info!("Listening for connections on {}", listener.local_addr()?);

    // Accept connections and create threads
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                let peer_addr = match stream.peer_addr() {
                    Ok(addr) => addr,
                    Err(e) => {
                        error!("Failed to get peer address, not accepting: {:?}", e);
                        continue;
                    }
                };
                info!("New connection: {:?}", peer_addr);
                let mut stream = stream;
                std::thread::spawn(move || {
                    handle_connection(&mut stream, args.interval);
                });
            }
            Err(e) => {
                error!("Failed to accept connection: {:?}", e);
            }
        }
    }
    Ok(())
}
