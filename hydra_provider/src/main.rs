mod serial_input;

use crate::serial_input::SerialInput;
use anyhow::Context;
use anyhow::Result;
use clap::Parser;
use env_logger::Env;
use log::*;
use messages::Message;
use postcard::from_bytes_cobs;
use serialport::available_ports;
use std::io::{BufRead, BufReader};
use std::time::Duration;

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

    loop {
        match reader.read_message() {
            Ok(msg) => {
                if let Ok(msg) = serde_json::to_string(&msg) {
                    info!("Received message: {msg}")
                }
            }
            Err(err) => info!("Error reading message: {err}"),
        }
    }
}
