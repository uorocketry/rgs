mod input;
mod processing;
mod zeromq_server;

use crate::input::SerialInput;
use crate::input::{HydraInput, RandomInput};
use crate::processing::Processing;
use crate::zeromq_server::ZeroMQServer;
use anyhow::Context;
use anyhow::Result;
use clap::ArgGroup;
use clap::Parser;
use log::*;
use std::sync::mpsc;
use std::thread;

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
    let (send, recv) = mpsc::channel();

    let args1 = args.clone();
    let send_handle = thread::spawn(move || -> Result<()> {
        let mut reader: Box<dyn HydraInput> = if !args1.random_input {
            info!("Using serial input");
            Box::new(SerialInput::new(&args1.serial_port, args1.baud_rate)?)
        } else {
            info!("Using random input");
            Box::new(RandomInput::new())
        };

        reader.read_loop(send);
    });

    let args2 = args.clone();
    let server_handle = thread::spawn(move || {
        info!("Starting ZeroMQ server on port {}", args2.zeromq_port);
        let server = ZeroMQServer::new(args2.zeromq_port);

        let processing = Processing::new();

        loop {
            let msg = recv
                .recv()
                .expect("Failed to receive message. Are all senders closed?");

            let result = (|| {
                debug!("Received message: {}", serde_json::to_string(&msg)?);

                let processed = processing.process(msg);

                debug!("Processed message: {}", serde_json::to_string(&processed)?);

                server.send(&processed).context("Failed to send message")
            })();

            if let Err(e) = result {
                error!("Failed to send message: {:?}", e);
            }
        }
    });

    send_handle.join().unwrap()?;
    server_handle.join().unwrap();

    Ok(())
}
