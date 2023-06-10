mod input;
mod processing;
mod zeromq_server;

use crate::input::SerialInput;
use crate::processing::{
    InputData, LinkData, LinkStatusProcessing, ProcessedMessage, RocketProcessing,
};
use crate::zeromq_server::ZeroMQServer;

use anyhow::Result;
use clap::ArgGroup;
use clap::Parser;
use log::*;
use std::sync::mpsc;
use std::sync::mpsc::{Receiver, Sender};
use std::thread;
use std::thread::JoinHandle;

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

    /// Port of the ZeroMQ server
    #[arg(short, long, env, default_value = "2223")]
    zeromq_port: u32,

    /// Simulate a source with random data for testing
    #[arg(short, long, env, default_value = "false")]
    random_input: bool,

    /// Logging level
    #[arg(short, long, env, default_value = "Info")]
    log: LevelFilter,
}

fn main() {
    let args = Args::parse();
    env_logger::Builder::from_default_env()
        .filter(None, args.log)
        .init();

    if let Err(err) = run(&args) {
        error!("{:?}", err)
    }
}

fn run(args: &Args) -> Result<()> {
    let (input_send, input_recv) = mpsc::channel();
    let (server_send, server_rcv) = mpsc::channel();

    let input_handle = start_input(args.clone(), input_send);
    let processing_handle = start_processing(input_recv, server_send);
    let server_handle = start_server(args.clone(), server_rcv);

    input_handle.join().unwrap();
    processing_handle.join().unwrap();
    server_handle.join().unwrap();

    Ok(())
}

fn start_input(args: Args, send: Sender<InputData>) -> JoinHandle<()> {
    thread::Builder::new()
        .name("Input".to_string())
        .spawn(move || {
            if !args.random_input {
                info!("Using serial input");
                SerialInput::new(&args.serial_port, args.baud_rate)
                    .expect("Could not start serial input")
                    .read_write_loop(send);
            } else {
                info!("Using random input | BROKEN");
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
                let msg = recv.recv().unwrap();
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
        })
        .unwrap()
}

fn start_server(args: Args, recv: Receiver<ProcessedMessage>) -> JoinHandle<()> {
    thread::Builder::new()
        .name("ZMQ Server".to_string())
        .spawn(move || {
            info!("Starting ZeroMQ server on port {}", args.zeromq_port);
            let server = ZeroMQServer::new(args.zeromq_port);

            loop {
                let msg = recv
                    .recv()
                    .expect("Failed to receive message. Are all senders closed?");

                trace!("Sending processed message: {:?}", msg);

                if let Err(e) = server.send(&msg) {
                    error!("Failed to send message: {:?}", e);
                }
            }
        })
        .unwrap()
}
