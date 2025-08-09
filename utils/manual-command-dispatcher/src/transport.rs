use mavlink::uorocketry::MavMessage;
use mavlink::{connect, MavConnection, MavHeader};
use std::error::Error;
use std::time::Duration;

pub fn connect_gateway(
    connection_string: &str,
) -> Result<Box<dyn MavConnection<MavMessage> + Send + Sync>, Box<dyn Error>> {
    match connect::<MavMessage>(connection_string) {
        Ok(c) => Ok(c),
        Err(e) => Err(e.into()),
    }
}

pub fn send_over_mavlink(
    conn: &mut Box<dyn MavConnection<MavMessage> + Send + Sync>,
    bytes: &[u8],
) -> Result<(), Box<dyn Error>> {
    let mut fixed = [0u8; 255];
    let len = bytes.len().min(255);
    fixed[..len].copy_from_slice(&bytes[..len]);
    let msg =
        MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA { message: fixed });
    conn.send(&MavHeader::default(), &msg)
        .map(|_| ())
        .map_err(|e| e.into())
}

pub fn try_recv_postcard(
    conn: &mut Box<dyn MavConnection<MavMessage> + Send + Sync>,
) -> Option<Vec<u8>> {
    match conn.recv() {
        Ok((_header, message)) => match message {
            MavMessage::POSTCARD_MESSAGE(data) => Some(data.message.to_vec()),
            _ => None,
        },
        Err(mavlink::error::MessageReadError::Io(io_err))
            if io_err.kind() == std::io::ErrorKind::WouldBlock =>
        {
            None
        }
        Err(_) => None,
    }
}
