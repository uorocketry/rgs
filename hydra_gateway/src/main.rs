use clap::{Parser, Subcommand};
use serialport::{available_ports, SerialPortType};
use std::collections::{HashMap, HashSet};
use std::io::Write;
use std::sync::mpsc::channel;
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;
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
            let mut port = serialport::new(&listen.serial, listen.baud)
                .open()
                .expect("Failed to open serial port");

            // region:Handle serial port read
            let (serial_read_tx, serial_read_rx) = channel();

            let port_reader_result = port.try_clone();

            let mut port_reader = match port_reader_result {
                Ok(reader) => reader,
                Err(e) => {
                    eprintln!("Error cloning serial port: {:?}", e);
                    return;
                }
            };

            let serial_read_tx_1 = serial_read_tx.clone();
            tokio::task::spawn_blocking(|| async move {
                let mut buffer: Vec<u8> = vec![0; 1024];
                loop {
                    match port_reader.read(&mut buffer) {
                        Ok(bytes_read) => {
                            if bytes_read > 0 {
                                serial_read_tx_1
                                    .send(buffer[..bytes_read].to_vec())
                                    .expect("Failed to send data to main thread");
                            }
                        }
                        Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => (),
                        Err(e) => {
                            eprintln!("Error reading from serial port: {:?}", e);
                        }
                    }
                }
            });
            // endregion

            println!("Host: {}", listen.host);

            let listener = TcpListener::bind(listen.host.clone())
                .await
                .expect("Failed to bind TCP listener");

            // region:Handle TCP connections
            let connections = Arc::new(Mutex::new(HashMap::new()));
            let (cleanup_queue_tx, cleanup_queue_rx) = channel();

            let connections_1 = connections.clone();
            tokio::spawn(async move {
                loop {
                    let connection_result = listener.accept().await;
                    match connection_result {
                        Ok((stream, addr)) => {
                            connections_1.lock().await.insert(addr, stream);
                        }
                        Err(e) => {
                            eprintln!("Error accepting connection: {:?}", e);
                        }
                    }
                }
            });
            // endregion

            // region:Write serial rx to TCP connections
            let connections_2 = connections.clone();
            let cleanup_queue_tx_1 = cleanup_queue_tx.clone();
            tokio::task::spawn(async move {
                loop {
                    let data_option = serial_read_rx.recv();
                    // result<vector<u8>, RecvError>
                    let data = match data_option {
                        Ok(data) => data,
                        Err(e) => {
                            eprintln!("Error receiving data from serial port: {:?}", e);
                            continue;
                        }
                    };

                    for (addr, stream) in connections_2.lock().await.iter_mut() {
                        match stream.write_all(&data).await {
                            Ok(_) => (),
                            Err(e) => {
                                eprintln!("Error writing to TCP stream: {:?}", e);
                                let cleanup_send = cleanup_queue_tx_1.send(*addr);
                                match cleanup_send {
                                    Ok(_) => (),
                                    Err(e) => {
                                        eprintln!(
                                            "Error sending {} to cleanup queue: {:?}",
                                            addr, e
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // region:Read TCP connections
            let (tcp_read_tx, tcp_read_rx) = channel();
            let connections_3 = connections.clone();
            let cleanup_queue_tx_2 = cleanup_queue_tx.clone();
            let tcp_read_tx_1 = tcp_read_tx.clone();
            tokio::spawn(async move {
                loop {
                    for (addr, stream) in connections_3.lock().await.iter_mut() {
                        let mut reader = BufReader::new(stream);
                        let mut buffer = Vec::new();
                        match reader.read_buf(&mut buffer).await {
                            Ok(_) => {
                                let tcp_read_result = tcp_read_tx_1.send((*addr, buffer));
                                match tcp_read_result {
                                    Ok(_) => (),
                                    Err(e) => {
                                        eprintln!(
                                            "Error sending TCP buffer to main thread: {:?}",
                                            e
                                        );
                                    }
                                }
                            }
                            Err(e) => {
                                eprintln!("Error reading from TCP stream: {:?}", e);
                                let cleanup_queue_result = cleanup_queue_tx_2.send(*addr);
                                match cleanup_queue_result {
                                    Ok(_) => (),
                                    Err(e) => {
                                        eprintln!(
                                            "Error sending {} to cleanup queue: {:?}",
                                            addr, e
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            });
            // endregion

            // region:Write TCP rx to serial port
            let cleanup_queue_tx_3 = cleanup_queue_tx.clone();
            tokio::task::spawn_blocking(|| async move {
                loop {
                    let tcp_read_rx_result = tcp_read_rx.recv();
                    let (addr, data) = match tcp_read_rx_result {
                        Ok(data) => data,
                        Err(e) => {
                            eprintln!("Error receiving data from main thread: {:?}", e);
                            continue;
                        }
                    };

                    match port.write_all(&data) {
                        Ok(_) => (),
                        Err(e) => {
                            eprintln!("Error writing to serial port: {:?}", e);
                            let cleanup_queue_send_result = cleanup_queue_tx_3.send(addr);
                            match cleanup_queue_send_result {
                                Ok(_) => (),
                                Err(e) => {
                                    eprintln!("Error sending {} to cleanup queue: {:?}", addr, e);
                                }
                            }
                        }
                    }
                }
            });
            // endregion

            // region:Cleanup closed connections
            let connections_4 = connections.clone();
            tokio::spawn(async move {
                loop {
                    let addr_maybe = cleanup_queue_rx.recv();
                    let addr = match addr_maybe {
                        Ok(addr) => addr,
                        Err(e) => {
                            eprintln!("Error receiving address from cleanup queue: {:?}", e);
                            continue;
                        }
                    };
                    let mut connection_guard = connections_4.lock().await;
                    let stream = match connection_guard.get_mut(&addr) {
                        Some(stream) => stream,
                        None => {
                            eprintln!("Connection {} not found", addr);
                            return;
                        }
                    };

                    match stream.shutdown().await {
                        Ok(_) => (),
                        Err(e) => {
                            eprintln!("Error shutting down TCP stream: {:?}", e);
                        }
                    }
                    connection_guard.remove(&addr);
                }
            });

            // Endless loop
            loop {
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
            }
        }
        None => {
            Cli::parse_from(&["", "--help"]);
        }
    }
}
