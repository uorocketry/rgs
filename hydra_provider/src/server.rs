use greeter::GreeterService;
use tonic::transport::Server;
mod input;
mod pb_client;
mod processing;

use crate::input::FileInput;
use crate::input::RandomInput;
use crate::input::SerialInput;
use crate::pb_client::PBClient;
use crate::processing::{
    InputData, LinkData, LinkStatusProcessing, ProcessedMessage, RocketProcessing,
};

use anyhow::Result;
use clap::ArgGroup;
use clap::Parser;
use log::*;
use std::sync::mpsc;
use std::sync::mpsc::{Receiver, Sender};
use std::thread;
use std::thread::JoinHandle;

mod greeter;

use crate::greeter::{hello_world::greeter_server::GreeterServer, GreeterImpl};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();
    env_logger::Builder::from_default_env()
        .filter(None, args.log)
        .init();

    if let Err(err) = run(&args).await {
        error!("{:?}", err)
    }

    Ok(())
}

/// Program to read and parse data from a HYDRA system
#[derive(Parser, Debug, Clone)]
#[command(author, version, about, long_about = None)]
#[command(group(
    ArgGroup::new("input")
        .required(false)
        .args(["serial_port", "random_input"])
))]
struct Args {
    /// Serial port to read from. If not specified, the first port found will be used.
    /// Is used as default input if not other inputs are specified.
    #[arg(short, long, env, default_value = "/dev/ttyUSB0")]
    serial_port: Option<String>,

    /// Baud rate to use for the serial connection
    #[arg(short, long, env, default_value = "57600")]
    baud_rate: u32,

    /// Pocketbase port
    #[arg(short, long, env, default_value = "3001")]
    pocketbase_port: u32,

    /// Simulate a source with random data for testing
    #[arg(short, long, env, default_value = "false")]
    random_input: bool,

    // Read from file, input path
    #[arg(short, long, env, default_value = "")]
    file_input: String,

    /// Logging level
    #[arg(short, long, env, default_value = "Info")]
    log: LevelFilter,
}

async fn run(args: &Args) -> Result<()> {
    let (mut health_reporter, health_service) = tonic_health::server::health_reporter();
    health_reporter.set_serving::<GreeterService>().await;

    let addr: std::net::SocketAddr = "[::1]:50051".parse().unwrap();

    println!("Hydra Provider listening on {}", addr);

    let (input_send, input_recv) = mpsc::channel();
    let (server_send, server_rcv) = mpsc::channel();

    let input_handle = start_input(args.clone(), input_send);
    let processing_handle = start_processing(input_recv, server_send);
    let server_handle = start_client(args.clone(), server_rcv);

    Server::builder()
        .add_service(health_service)
        .add_service(GreeterServer::new(GreeterImpl::default()))
        .serve(addr)
        .await?;

    input_handle.join().unwrap();
    processing_handle.join().unwrap();
    server_handle.join().unwrap();

    Ok(())
}

fn start_input(args: Args, send: Sender<InputData>) -> JoinHandle<()> {
    thread::Builder::new()
        .name("Input".to_string())
        .spawn(move || {
            if !args.file_input.is_empty() {
                info!("Reading from file");
                FileInput::new(args.file_input)
                    .process_file(send)
                    .expect("Could not process file");
            } else if !args.random_input {
                info!("Using serial input");
                SerialInput::new(&args.serial_port, args.baud_rate)
                    .expect("Could not start serial input")
                    .read_write_loop(send);
            } else {
                info!("Using random input");
                RandomInput::new().read_loop(send);
            }
        })
        .unwrap()
}

fn start_processing(
    recv: Receiver<InputData>,
    server_send: Sender<ProcessedMessage>,
) -> JoinHandle<()> {
    let (link_send, link_recv) = mpsc::channel();
    let send2 = server_send.clone();
    thread::Builder::new()
        .name("Radio Status Processing".to_string())
        .spawn(move || {
            let mut link_status = LinkStatusProcessing::new();

            link_status.process_loop(link_recv, send2);
        })
        .unwrap();

    thread::Builder::new()
        .name("Processing".to_string())
        .spawn(move || {
            let rocket_processing = RocketProcessing::new();
            loop {
                let msg = recv.recv();
                match msg {
                    Ok(msg) => {
                        trace!("Received data: {:?}", msg);
                        match msg {
                            InputData::RocketData(data) => {
                                server_send.send(rocket_processing.process(data)).unwrap();
                            }
                            InputData::MavlinkRadioStatus(status) => {
                                link_send.send(LinkData::RadioStatus(status)).unwrap()
                            }
                            InputData::MavlinkHeader(header) => {
                                link_send.send(LinkData::MavlinkHeader(header)).unwrap()
                            }
                            InputData::MavlinkHeartbeat() => {
                                link_send.send(LinkData::MavlinkHeartbeat()).unwrap()
                            }
                        }
                    }
                    Err(_) => {
                        continue;
                    }
                };
            }
        })
        .unwrap()
}

// fn start_client(args: Args, recv: Receiver<ProcessedMessage>) -> JoinHandle<()> {
//     thread::Builder::new()
//         .name("Pocketbase Client".to_string())
//         .spawn(move || {
//             info!(
//                 "Starting Pocketbase client on port {}",
//                 args.pocketbase_port
//             );
//             let server = PBClient::new(args.pocketbase_port);

//             loop {
//                 let msg = recv
//                     .recv()
//                     .expect("Failed to receive message. Are all senders closed?");

//                 trace!("Sending processed message: {:?}", msg);

//                 if let Err(e) = server.send(&msg) {
//                     error!("Failed to send message: {:?}", e);
//                 }
//             }
//         })
//         .unwrap()
// }
