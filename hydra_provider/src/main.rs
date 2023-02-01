mod input;
mod zeromq_server;

use crate::input::SerialInput;
use crate::input::{HydraInput, RandomInput};
use crate::zeromq_server::ZeroMQServer;
use anyhow::Context;
use anyhow::Result;
use clap::ArgGroup;
use clap::Parser;
use log::*;

/// Program to read and parse data from a HYDRA system
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
#[command(group(
    ArgGroup::new("input")
        .required(false)
        .args(["serial_port", "random_input"])
))]
struct Args {
    /// Serial port to read from. If not specified, the first port found will be used.
    /// Is used as default input if not other inputs are specified.
    #[arg(short, long, env)]
    serial_port: Option<String>,

    /// Baud rate to use for the serial connection
    #[arg(short, long, env, default_value = "9600")]
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
    let mut reader: Box<dyn HydraInput> = if !args.random_input {
        info!("Using serial input");
        Box::new(SerialInput::new(&args.serial_port, args.baud_rate)?)
    } else {
        info!("Using random input");
        Box::new(RandomInput::new())
    };

    info!("Starting ZeroMQ server on port {}", args.zeromq_port);
    let server = ZeroMQServer::new(args.zeromq_port);

    loop {
        let result: Result<_> = (|| {
            let msg = reader.read_message().context("Failed to read message")?;

            server.send(&msg).context("Failed to send message")?;

            debug!("Received message: {}", serde_json::to_string(&msg)?);

            Ok(())
        })();

        if let Err(err) = result {
            error!("Error reading and sending message: {:?}", err);
        }
    }
}
