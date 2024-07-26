use clap::{Parser, Subcommand};
use serialport::{available_ports, SerialPortType};
use std::collections::HashMap;
use std::io::Write;
use std::sync::mpsc::channel;
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;
use tokio::runtime::Handle;
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
    let handle = Handle::current();

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
                .timeout(std::time::Duration::from_secs(1))
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

            std::thread::spawn(move || {
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
            let tcp_handle_task = tokio::spawn(async move {
                loop {
                    let (stream, addr) = match listener.accept().await {
                        Ok(connection) => connection,
                        Err(e) => {
                            eprintln!("Error accepting TCP connection: {:?}", e);
                            continue;
                        }
                    };
                    // TODO: Handle requests
                    tokio::spawn(async move {
                        handle_client(stream, addr).await;
                    });
                }
            });
            // endregion

            // region:Write serial rx to TCP connections
            let connections_2 = connections.clone();
            let cleanup_queue_tx_1 = cleanup_queue_tx.clone();
            let serial_write_to_tcp_task = tokio::task::spawn(async move {
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
            let read_tcp_task = tokio::spawn(async move {
                loop {
                    for (addr, stream) in connections_3.lock().await.iter_mut() {
                        let mut buffer = Vec::new();
                        println!("Reading from TCP connection {}", addr);
                        match stream.read_buf(&mut buffer).await {
                            Ok(0) => {
                                let cleanup_queue_result = cleanup_queue_tx_2.send(*addr);
                                match cleanup_queue_result {
                                    Ok(_) => (),
                                    Err(e) => {
                                        eprintln!(
                                            "Zero Buf Error sending {} to cleanup queue: {:?}",
                                            addr, e
                                        );
                                    }
                                }
                            }

                            Ok(_) => {
                                println!("Read {} bytes from TCP connection", buffer.len());
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
            let tcp_read_tx_2 = tcp_read_tx.clone();
            std::thread::spawn(move || loop {
                let tcp_read_rx_result = tcp_read_rx.recv();
                let (addr, data) = match tcp_read_rx_result {
                    Ok(data) => data,
                    Err(e) => {
                        eprintln!("Error receiving data from main thread: {:?}", e);
                        continue;
                    }
                };
                match port.write_all(&data) {
                    Ok(_) => {
                        println!("Wrote {} bytes to serial port", data.len());
                    }
                    Err(ref e) if e.kind() == std::io::ErrorKind::TimedOut => {
                        eprintln!("Serial port write timed out");

                        // sleep for backoff 0.2 s
                        std::thread::sleep(std::time::Duration::from_millis(200));

                        let send_res = tcp_read_tx_2.send((addr, data));

                        match send_res {
                            Ok(_) => (),
                            Err(e) => {
                                eprintln!("Error sending serial data back to main thread: {:?}", e);
                            }
                        }
                    }
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
            });

            // endregion

            // region:Cleanup closed connections
            let connections_4 = connections.clone();
            let connection_cleanup_task = tokio::spawn(async move {
                loop {
                    let addr_maybe = cleanup_queue_rx.recv();
                    let mut connection_guard = connections_4.lock().await;
                    let addr = match addr_maybe {
                        Ok(addr) => addr,
                        Err(e) => {
                            eprintln!("Error receiving address from cleanup queue: {:?}", e);
                            continue;
                        }
                    };

                    // print list of connections
                    println!("Connections: {:?}", connection_guard.keys());

                    let stream = match connection_guard.get_mut(&addr) {
                        Some(stream) => stream,
                        None => {
                            connection_guard.remove(&addr);
                            continue;
                        }
                    };

                    match stream.shutdown().await {
                        Ok(_) => (),
                        Err(e) => {
                            eprintln!("Error shutting down TCP stream: {:?}", e);
                        }
                    }
                    connection_guard.remove(&addr);
                    println!("Connection {} closed", addr);
                }
            });

            // Join all tasks
            let _ = tokio::try_join!(
                tcp_handle_task,
                serial_write_to_tcp_task,
                read_tcp_task,
                connection_cleanup_task
            );
        }
        None => {
            Cli::parse_from(&["", "--help"]);
        }
    }
}

struct SharedState {
    connections: HashMap<std::net::SocketAddr, tokio::net::TcpStream>,
}

impl SharedState {
    pub fn new() -> Self {
        SharedState {
            connections: HashMap::new(),
        }
    }

    // Broadcast serial data to all TCP connections
    async fn broadcast(&self, data: Vec<u8>) {
        for (_, stream) in self.connections.iter() {
            match stream.write_all(&data).await {
                Ok(_) => (),
                Err(e) => {
                    eprintln!("Error writing to TCP stream: {:?}", e);
                }
            }
        }

    }
}

async fn handle_client(
    mut stream: tokio::net::TcpStream,
    addr: std::net::SocketAddr,
    serial_write_tx: std::sync::mpsc::Sender<Vec<u8>>,
    serial_read_rx: std::sync::mpsc::Receiver<Vec<u8>>,
) {
    println!("New connection from {}", addr);

    let (tx, rx) = channel();

    let (reader, writer) = stream.split();
    let mut reader = BufReader::new(reader);

    let tx_1 = tx.clone();
    tokio::spawn(async move {
        loop {
            let mut buffer = Vec::new();
            match reader.read_buf(&mut buffer).await {
                Ok(0) => {
                    println!("Connection {} closed", addr);
                    return;
                }
                Ok(_) => {
                    println!("Read {} bytes from TCP connection", buffer.len());
                    let tx_result = tx_1.send(buffer);
                    match tx_result {
                        Ok(_) => (),
                        Err(e) => {
                            eprintln!("Error sending TCP buffer to main thread: {:?}", e);
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Error reading from TCP stream: {:?}", e);
                    return;
                }
            }
        }
    });

    let mut writer = tokio::io::BufWriter::new(writer);

    loop {
        let data_option = rx.recv();
        let data = match data_option {
            Ok(data) => data,
            Err(e) => {
                eprintln!("Error receiving data from main thread: {:?}", e);
                return;
            }
        };

        match writer.write_all(&data).await {
            Ok(_) => (),
            Err(e) => {
                eprintln!("Error writing to TCP stream: {:?}", e);
                return;
            }
        }
    }
}
)