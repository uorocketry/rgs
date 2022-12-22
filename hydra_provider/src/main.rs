use clap::Parser;
use messages::Message;
use postcard::from_bytes_cobs;
use serialport::available_ports;
use std::error::Error;
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
    let args = Args::parse();

    let port = if let Some(port) = args.serial_port {
        port
    } else {
        available_ports()
            .expect("No serial port specified and couldn't retrieve available ports")
            .iter()
            .filter(|x| x.port_name.contains("USB"))
            .last()
            .expect("No serial port specified and couldn't find any port")
            .port_name
            .clone()
    };

    println!("Using serial port '{}'", port);

    let port = serialport::new(&port, args.baud_rate)
        .timeout(Duration::new(30, 0))
        .open()
        .unwrap_or_else(|_| panic!("Failed to open serial connection {}", port));

    let mut f = BufReader::new(port);

    loop {
        match read_message(&mut f) {
            Ok(msg) => println!("Received message: {:?}", serde_json::to_string(&msg)),
            Err(err) => println!("Error reading message: {}", err),
        }
    }
}

fn read_message(mut reader: impl BufRead) -> Result<Message, Box<dyn Error>> {
    let mut data = vec![];
    reader.read_until(0x0, &mut data)?;

    let msg: Message = from_bytes_cobs(data.as_mut_slice())?;

    Ok(msg)
}
