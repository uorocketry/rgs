use clap::{Parser, Subcommand};
use mavlink::uorocketry::MavMessage;
use messages::Message;
use postcard::from_bytes;
use serialport::{available_ports, SerialPortType};
use std::collections::HashMap;
use std::fmt::format;
use std::io::Write;
use std::process::exit;
use std::sync::{Arc, Mutex};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;
use tokio::stream;
use tokio::sync::mpsc::{Sender, UnboundedSender};

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Ports,
    Listen(Listen),
}

#[derive(Parser)]
struct Listen {
    #[arg(long)]
    serial: String,
    #[arg(long, default_value_t = 9600)]
    baud: u32,
    #[arg(long, action, default_value = "127.0.0.1:5656")] // Trivia H + Y + D + R +  A = 56 :D
    host: String,
}

fn list_available_ports() -> Vec<String> {
    return available_ports()
        .unwrap_or_default()
        .iter()
        .filter(|port| matches!(port.port_type, SerialPortType::UsbPort(_)))
        .map(|port| port.port_name.clone())
        .collect::<Vec<String>>();
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Ports) => {
            // Print available ports separated by spaces
            println!("{}", list_available_ports().join(" "));
        }
        Some(Commands::Listen(listen)) => {
            println!("Listening on {} at {} baud", listen.serial, listen.baud);

            // region:Delete Me

            println!("Listening on {} at {} baud", listen.serial, listen.baud);
            let connection_str = format!("serial:/dev/ttyUSB0:57600");
            println!("Connection String: {}", connection_str);
            let connection = mavlink::connect::<MavMessage>(&connection_str).unwrap();

            println!("Connection Loop");
            loop {
                println!("Waiting for message");
                let (_, mavlink_message) = connection.recv().unwrap();
                println!("Received message");

                match &mavlink_message {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        let data: Message = from_bytes(data.message.as_slice()).unwrap();
                        println!("Received rocket message: {:#?}", data);
                        let json = serde_json::to_string(&data).unwrap();
                        println!("MSG: {}", json);
                    }
                    _ => {
                        println!("Received non post card message: {:?}", mavlink_message);
                    } // MavMessage::POSTCARD_MESSAGE(data) => {
                      //     let data: Message = from_bytes(data.message.as_slice()).unwrap();
                      //     info!("Received rocket message: {:#?}", data);
                      //     HydraInput::Message(data)
                      // }
                      // MavMessage::RADIO_STATUS(data) => {
                      //     info!("Received radio status: {:?}", data);
                      //     HydraInput::RadioStatus(data.clone())
                      // }
                      // MavMessage::HEARTBEAT(heartbeat) => {
                      //     info!("Received heartbeat.");
                      //     HydraInput::Heartbeat(heartbeat.clone())
                      // }
                };

                // println!("{:?}", message);
            }

            // endregion

            // region:Open serial
            let mut port = match serialport::new(&listen.serial, listen.baud)
                .timeout(std::time::Duration::from_secs(2))
                .open()
            {
                Ok(port) => port,
                Err(e) => {
                    eprintln!("Error opening serial port: {:?}", e);
                    return;
                }
            };
            // endregion

            let shared_state = Arc::new(Mutex::new(SharedState::new()));

            // region:Read & Broadcast

            let mut port_reader = port.try_clone().unwrap();

            let shared_state_clone = Arc::clone(&shared_state);
            let serial_reader = std::thread::spawn(move || {
                let mut buffer = vec![0; 1024];
                loop {
                    match port_reader.read(&mut buffer) {
                        Ok(bytes_read) => {
                            // FIXME: Remove print
                            println!("Read {} bytes from serial port", bytes_read);
                            println!("{}", String::from_utf8_lossy(&buffer[..bytes_read]));
                            if bytes_read > 0 {
                                shared_state_clone
                                    .lock()
                                    .unwrap()
                                    .broadcast(buffer[..bytes_read].to_vec());
                            }
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => (),
                        Err(ref e) if e.kind() == std::io::ErrorKind::BrokenPipe => {
                            panic!("{:?}", e);
                        }
                        Err(e) => {
                            eprintln!("Error reading from serial port: {:?}", e);
                        }
                    }
                }
            });

            // endregion

            println!("Host: {}", listen.host);

            // region:TCP Listener
            let listener = match TcpListener::bind(listen.host.clone()).await {
                Ok(listener) => listener,
                Err(e) => {
                    eprintln!("Error binding to TCP listener: {:?}", e);
                    return;
                }
            };
            // endregion

            // region:Handle TCP connections
            let port_clone = port.try_clone().unwrap();
            let shared_state_clone = Arc::clone(&shared_state);
            let tcp_handle_task = tokio::spawn(async move {
                loop {
                    let (stream, addr) = match listener.accept().await {
                        Ok(connection) => connection,
                        Err(e) => {
                            eprintln!("Error accepting TCP connection: {:?}", e);
                            continue;
                        }
                    };

                    println!("Accepted connection from: {}", addr);
                    // Split
                    let (mut stream_read, mut stream_write) = stream.into_split();

                    let (client_serial_read_tx, mut client_serial_read_rx) =
                        tokio::sync::mpsc::unbounded_channel();

                    // Add client client_serial_read_tx to shared state
                    shared_state_clone
                        .lock()
                        .unwrap()
                        .connections
                        .insert(addr, client_serial_read_tx);

                    let port_clone = port_clone.try_clone().unwrap();
                    tokio::spawn(async move {
                        let mut port_clone = port_clone.try_clone().unwrap();

                        // // Handle Client Writes
                        let write_task = tokio::spawn(async move {
                            loop {
                                let mut buffer = Vec::new();
                                match stream_read.read_buf(&mut buffer).await {
                                    Ok(_) => match port_clone.write_all(&buffer) {
                                        Ok(_) => {
                                            if (buffer.len() == 0) {
                                                println!("Client disconnected");
                                                break;
                                            }
                                            println!("Wrote {} bytes to serial port", buffer.len());
                                        }
                                        Err(e) => {
                                            eprintln!("Error writing to serial port: {:?}", e);
                                        }
                                    },
                                    Err(e) => {
                                        eprintln!("Error reading from TCP connection: {:?}", e);
                                        break;
                                    }
                                }
                            }
                        });
                        // endregion

                        // region:Handle Client Reads
                        let read_task = tokio::spawn(async move {
                            loop {
                                match client_serial_read_rx.recv().await {
                                    Some(data) => match stream_write.write_all(&data).await {
                                        Ok(_) => {
                                            println!(
                                                "Wrote {} bytes to TCP connection",
                                                data.len()
                                            );
                                        }
                                        Err(e) => {
                                            eprintln!("Error writing to TCP connection: {:?}", e);
                                            break;
                                        }
                                    },
                                    None => {
                                        eprintln!("Error receiving data from serial port");
                                        break;
                                    }
                                }
                            }
                        });
                        // endregion

                        write_task.await.unwrap();
                        read_task.await.unwrap();
                    });
                }
            });

            // endregion

            // Join
            tcp_handle_task.await.unwrap();
            serial_reader.join().unwrap();
        }
        None => {
            Cli::parse_from(&["", "--help"]);
        }
    }
}

struct SharedState {
    connections: HashMap<std::net::SocketAddr, UnboundedSender<Vec<u8>>>,
}

impl SharedState {
    pub fn new() -> Self {
        SharedState {
            connections: HashMap::new(),
        }
    }

    fn dispose(&mut self) {
        for (_, sender) in self.connections.iter_mut() {
            drop(sender.to_owned())
        }
        self.connections.clear();
    }

    // Broadcast serial data to all TCP connections
    fn broadcast(&mut self, data: Vec<u8>) {
        println!(
            "Broadcasting data to {} TCP connections",
            self.connections.len()
        );
        let mut to_remove = Vec::new();
        for (_, stream) in self.connections.iter_mut() {
            match stream.send(data.clone()) {
                Ok(_) => (),
                Err(e) => {
                    eprintln!("Error Broadcasting data to TCP connection: {:?}", e);
                    eprintln!("Removing connection from shared state");
                    to_remove.push(stream as *const _);
                }
            }
        }

        // Is there a better way to remove elements from a hashmap while iterating?

        // self.connections.clear(); on all to remove
        // to_remove.iter().for_each(|&stream| {
        //     self.connections.remove(&(stream as *const _));
        // });

        self.connections
            .retain(|_, stream| !to_remove.contains(&(stream as *const _)));
    }
}
