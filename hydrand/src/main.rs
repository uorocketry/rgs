use clap::Parser;
use messages_prost::{common::Node, radio::{RadioFrame, radio_frame}, sensor::{sbg::{SbgData, sbg_data}}};
use messages_prost::prost::Message as _;
use rand::Rng;
use std::time::Duration;
use tracing::{info};
use nix::pty::{openpty, Winsize, OpenptyResult};
use std::os::fd::AsRawFd;
use std::fs;

#[derive(Parser, Debug, Clone)]
#[command(version, about, long_about = None)]
struct Args {
    /// Create PTY and symlink alias at this path
    #[arg(long, default_value = "/tmp/sergw-serial")]
    serial_alias: String,
    /// Message rate in Hz (unused for now; placeholder if we add streaming later)
    #[arg(long, default_value_t = 10)]
    rate_hz: u32,
}

fn encode_frame(frame: &RadioFrame) -> Vec<u8> { frame.encode_length_delimited_to_vec() }

fn random_imu() -> messages_prost::sbg::Imu {
    let mut rng = rand::thread_rng();
    messages_prost::sbg::Imu {
        time_stamp: 0,
        status: None,
        gyroscopes: Some(messages_prost::sbg::ImuGyroData { gyroscopes: Some(messages_prost::sbg::Vector3{ x: rng.gen_range(-0.01..0.01), y: rng.gen_range(-0.01..0.01), z: rng.gen_range(-0.01..0.01) }), delta_angle: Some(messages_prost::sbg::Vector3{ x: 0.0, y: 0.0, z: 0.0 }) }),
        accelerometers: Some(messages_prost::sbg::ImuAccelData { accelerometers: Some(messages_prost::sbg::Vector3{ x: rng.gen_range(-0.05..0.05), y: rng.gen_range(-0.05..0.05), z: 1.0 + rng.gen_range(-0.02..0.02) }), delta_velocity: Some(messages_prost::sbg::Vector3{ x: 0.0, y: 0.0, z: 0.0 }) }),
        temperature: Some(25.0 + rng.gen_range(-0.5..0.5)),
    }
}

fn make_imu_frame() -> Vec<u8> {
    let sbg = SbgData { data: Some(sbg_data::Data::Imu(random_imu())) };
    let frame = RadioFrame { node: Node::Phoenix as i32, payload: Some(radio_frame::Payload::Sbg(sbg)) };
    encode_frame(&frame)
}

fn make_pong() -> Vec<u8> {
    let log = messages_prost::log::Log { level: 1, message: b"pong".to_vec(), event: 0, node: Node::Phoenix as i32 };
    let frame = RadioFrame { node: Node::Phoenix as i32, payload: Some(radio_frame::Payload::Log(log)) };
    encode_frame(&frame)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();
    let args = Args::parse();
    // Create PTY and symlink for sergw to open as a "serial" device
    let ws = Winsize { ws_row: 24, ws_col: 80, ws_xpixel: 0, ws_ypixel: 0 };
    let OpenptyResult { master: _, slave } = openpty(Some(&ws), None)?;
    let slave_symlink = format!("/proc/self/fd/{}", slave.as_raw_fd());
    let slave_path = fs::read_link(&slave_symlink)?;
    let alias = args.serial_alias;
    let _ = fs::remove_file(&alias);
    std::os::unix::fs::symlink(&slave_path, &alias)?;
    info!("hydrand created virtual serial at {} (alias {})", slave_path.to_string_lossy(), alias);
    // Keep running so the PTY stays alive
    loop { tokio::time::sleep(Duration::from_secs(60)).await; }
}


