mod serial_input;
mod zeromq_server;

use crate::serial_input::SerialInput;
use crate::zeromq_server::ZeroMQServer;
use anyhow::Context;
use anyhow::Result;
use clap::Parser;
use env_logger::Env;
use log::*;

/// Program to read and parse data from a HYDRA system
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Serial port to read from. If not specified, the first port found will be used.
    #[arg(short, long, env)]
    serial_port: Option<String>,

    /// Baud rate to use for the serial connection
    #[arg(short, long, env, default_value = "9600")]
    baud_rate: u32,
}

fn main() {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    if let Err(err) = run() {
        error!("{:?}", err)
    }
}

fn run() -> Result<()> {
    let args = Args::parse();

    let mut reader = SerialInput::new(&args.serial_port, args.baud_rate)?;
    let server = ZeroMQServer::new();

    loop {
        let result: Result<_> = (|| {
            let msg = reader.read_message().context("Failed to read message")?;

            server.send(&msg).context("Failed to send message")?;

            debug!("Received message: {}", serde_json::to_string(&msg)?);

            Ok(())
        })();

        if let Err(err) = result {
            error!("Error reading and sending message: {}", err);
        }
    }
}
