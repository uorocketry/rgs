use clap::Parser;
use mavlink::connect;
use mavlink::uorocketry::MavMessage;
use tracing::{error, info, trace};
use tracing_subscriber;

#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[arg(short, long, default_value = "127.0.0.1")]
    address: String,

    #[arg(short, long, default_value_t = 5656)]
    port: u16,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::TRACE)
        .init();

    let args = Args::parse();
    let connection_string = format!("tcpout:{}:{}", args.address, args.port);

    info!("Attempting to connect to {}", connection_string);

    let connection = match connect::<MavMessage>(&connection_string) {
        Ok(connection) => {
            info!("Successfully connected");
            connection
        }
        Err(error) => {
            error!("Failed to connect: {}", error);
            return Err(error.into());
        }
    };

    loop {
        match connection.send(
            &mavlink::MavHeader {
                system_id: 0,
                component_id: 0,
                sequence: 0,
            },
            &MavMessage::HEARTBEAT(mavlink::uorocketry::HEARTBEAT_DATA {
                custom_mode: 0,
                mavtype: 0,
                autopilot: 0,
                base_mode: 0,
                system_status: 0,
                mavlink_version: 2,
            }),
        ) {
            Ok(_) => trace!("Heartbeat message sent successfully"),
            Err(error) => error!("Failed to send heartbeat message: {}", error),
        }
        std::thread::sleep(std::time::Duration::from_secs(10));
    }
}
