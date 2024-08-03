use clap::{Parser, Subcommand};
use serialport::{available_ports, SerialPortType};
use std::collections::HashMap;
use std::io::Write;
use std::sync::mpsc::{channel, Sender};
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;
use tokio::runtime::Handle;
use tokio::stream;
use tokio::sync::Mutex;

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

            // Open the serial port
            let port = match serialport::new(&listen.serial, listen.baud)
                .timeout(std::time::Duration::from_secs(1))
                .open()
            {
                Ok(port) => port,
                Err(e) => {
                    eprintln!("Error opening serial port: {:?}", e);
                    return;
                }
            };

            let shared_state = Arc::new(Mutex::new(SharedState::new()));

            // region Handle serial port read
            let (serial_read_tx, serial_read_rx) = channel();

            let port_reader_result = port.try_clone();

            let mut port_reader = match port_reader_result {
                Ok(reader) => reader,
                Err(e) => {
                    eprintln!("Error cloning serial port: {:?}", e);
                    return;
                }
            };

            let serial_read_tx_clone = serial_read_tx.clone();

            std::thread::spawn(move || {
                let mut buffer = Vec::new();
                loop {
                    match port_reader.read(&mut buffer) {
                        Ok(bytes_read) => {
                            if bytes_read > 0 {
                                // FIXME: Remove print
                                print!("{}", String::from_utf8_lossy(&buffer[..bytes_read]));
                                match serial_read_tx_clone.send(buffer[..bytes_read].to_vec()) {
                                    Ok(_) => (),
                                    Err(e) => {
                                        eprintln!("Error sending data to main thread: {:?}", e);
                                    }
                                }
                            }
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => (),
                        Err(e) => {
                            eprintln!("Error reading from serial port: {:?}", e);
                        }
                    }
                }
            });

            let shared_state_clone = Arc::clone(&shared_state);
            tokio::spawn(async move {
                loop {
                    let data = match serial_read_rx.recv() {
                        Ok(data) => data,
                        Err(e) => {
                            eprintln!("Error receiving data from serial port: {:?}", e);
                            continue;
                        }
                    };

                    shared_state_clone.lock().await.broadcast(data).await;
                }
            });

            // endregion

            println!("Host: {}", listen.host);

            let listener = match TcpListener::bind(listen.host.clone()).await {
                Ok(listener) => listener,
                Err(e) => {
                    eprintln!("Error binding to TCP listener: {:?}", e);
                    return;
                }
            };

            // region:Handle TCP connections
            let mut port_clone = port.try_clone().unwrap();
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

                    let (client_serial_read_tx, client_serial_read_rx) = channel();
                    let (client_serial_write_tx, client_serial_write_rx) = channel();

                    let client_serial_write_tx_clone = client_serial_write_tx.clone();
                    tokio::spawn(async move {
                        handle_client(
                            stream,
                            addr,
                            client_serial_read_rx,
                            client_serial_write_tx_clone.clone(),
                        )
                        .await;
                    });

                    // Add client client_serial_read_tx to shared state
                    shared_state_clone
                        .lock()
                        .await
                        .connections
                        .insert(addr, client_serial_read_tx);

                    // Handle Client Writes
                    let client_serial_write_tx_clone = client_serial_write_tx.clone();
                    let mut port_clone = port_clone.try_clone().unwrap();
                    std::thread::spawn(move || loop {
                        let data = match client_serial_write_rx.recv() {
                            Ok(data) => data,
                            Err(e) => {
                                eprintln!("Error receiving data from client: {:?}", e);
                                return;
                            }
                        };

                        match port_clone.write_all(&data) {
                            Ok(_) => {
                                println!("Wrote {} bytes to serial port", data.len());
                            }
                            Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => {
                                eprintln!("Serial port write timed out");

                                // sleep for backoff 0.2 s
                                std::thread::sleep(std::time::Duration::from_millis(200));

                                let send_res = client_serial_write_tx_clone.send(data);

                                match send_res {
                                    Ok(_) => (),
                                    Err(e) => {
                                        eprintln!(
                                            "Error sending serial data back to main thread: {:?}",
                                            e
                                        );
                                    }
                                }
                            }
                            Err(e) => {
                                eprintln!("Error writing to serial port: {:?}", e);
                            }
                        }
                    });
                }
            });

            // endregion

            // Join
            let _ = tcp_handle_task.await;
        }
        None => {
            Cli::parse_from(&["", "--help"]);
        }
    }
}

struct SharedState {
    connections: HashMap<std::net::SocketAddr, Sender<Vec<u8>>>,
}

impl SharedState {
    pub fn new() -> Self {
        SharedState {
            connections: HashMap::new(),
        }
    }

    // Broadcast serial data to all TCP connections
    async fn broadcast(&mut self, data: Vec<u8>) {
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
        self.connections
            .retain(|_, stream| !to_remove.contains(&(stream as *const _)));
    }
}

async fn handle_client(
    stream: tokio::net::TcpStream,
    addr: std::net::SocketAddr,
    serial_read_rx: std::sync::mpsc::Receiver<Vec<u8>>,
    serial_write_tx: std::sync::mpsc::Sender<Vec<u8>>,
) {
    println!("New connection from {}", addr);
    let stream_mutex = Arc::new(Mutex::new(stream));

    // Read from serial_read_rx and write to TCP stream in a task
    let addr_clone = addr.clone();
    let stream_clone = stream_mutex.clone();

    let serial_read_task = std::thread::spawn(move || async move {
        loop {
            let data = match serial_read_rx.recv() {
                Ok(data) => data,
                Err(e) => {
                    eprintln!(
                        "Connection {} closed due to serial read error: {:?}",
                        addr_clone, e
                    );
                    return;
                }
            };

            match stream_clone.lock().await.write_all(&data).await {
                Ok(_) => (),
                Err(e) => {
                    eprintln!(
                        "Connection {} closed due to TCP write error: {:?}",
                        addr_clone, e
                    );
                    return;
                }
            }
        }
    });

    // Read from TCP stream and write to serial_write_tx in a task
    let addr_clone_2 = addr.clone();
    let stream_clone = Arc::clone(&stream_mutex);
    let serial_write_result = tokio::spawn(async move {
        let mut buffer = Vec::new();
        buffer.reserve(1024);
        loop {
            buffer.clear();
            match stream_clone.lock().await.read_buf(&mut buffer).await {
                Ok(0) => {
                    eprintln!("Connection {} closed due to TCP read error", addr_clone_2);
                    return;
                }
                Ok(_) => match serial_write_tx.send(buffer.clone()) {
                    Ok(_) => (),
                    Err(e) => {
                        eprintln!(
                            "Connection {} closed due to serial write error: {:?}",
                            addr_clone_2, e
                        );
                        return;
                    }
                },
                Err(e) => {
                    eprintln!(
                        "Connection {} closed due to TCP read error: {:?}",
                        addr_clone_2, e
                    );
                    return;
                }
            }
        }
    })
    .await;

    // Join the os tasks
    let serial_read_result = serial_read_task.join();

    match serial_read_result {
        Ok(_) => (),
        Err(e) => {
            eprintln!("Error joining serial read task: {:?}", e);
        }
    }

    match serial_write_result {
        Ok(_) => (),
        Err(e) => {
            eprintln!("Error joining serial write task: {:?}", e);
        }
    }
}
