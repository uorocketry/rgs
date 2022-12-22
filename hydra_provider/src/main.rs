use anyhow::Context;
use anyhow::Result;
use clap::Parser;
use env_logger::Env;
use log::*;
use messages::Message;
use postcard::from_bytes_cobs;
use std::time::Duration;
use tokio::io::{AsyncBufRead, AsyncBufReadExt, BufReader};
use tokio_serial::{available_ports, SerialPortBuilderExt};

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

#[tokio::main]
async fn main() -> Result<()> {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    let args = Args::parse();

    let port = if let Some(port) = args.serial_port {
        port
    } else {
        available_ports()
            .context("No serial port specified and couldn't retrieve available ports")?
            .iter()
            .filter(|x| x.port_name.contains("USB"))
            .last()
            .context("No serial port specified and couldn't find any port")?
            .port_name
            .clone()
    };

    info!("Using serial port '{port}'");

    let port = tokio_serial::new(&port, args.baud_rate)
        .timeout(Duration::new(30, 0))
        .open_native_async()
        .with_context(|| format!("Failed to open serial connection '{port}'"))?;

    let mut f = BufReader::new(port);

    loop {
        match read_message(&mut f).await {
            Ok(msg) => {
                if let Ok(msg) = serde_json::to_string(&msg) {
                    info!("Received message: {msg}")
                }
            }
            Err(err) => info!("Error reading message: {err}"),
        }
    }
}

async fn read_message<T: AsyncBufRead + Unpin>(reader: &mut T) -> Result<Message> {
    let mut data = vec![];
    reader.read_until(0x0, &mut data).await?;

    let msg: Message = from_bytes_cobs(data.as_mut_slice())?;

    Ok(msg)
}
