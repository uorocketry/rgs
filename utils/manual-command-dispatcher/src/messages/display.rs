use messages_prost::command as cmd;
use messages_prost::common::Node;
use messages_prost::radio::{self, RadioFrame};
use messages_prost::sensor::sbg::sbg_data;
use prost::Message as _;
use tracing::{debug, warn};

#[derive(Clone, Debug)]
pub struct SentMessage {
    pub summary: String,
}

pub fn summarize_command(node_from: i32, command: &cmd::Command) -> SentMessage {
    let origin = Node::try_from(node_from).unwrap_or(Node::Unspecified);
    let target = Node::try_from(command.node).unwrap_or(Node::Unspecified);
    let details = match command.data.as_ref() {
        Some(cmd::command::Data::Online(v)) => format!("Online online={} ", v.online),
        Some(cmd::command::Data::DeployDrogue(v)) => format!("DeployDrogue val={} ", v.val),
        Some(cmd::command::Data::DeployMain(v)) => format!("DeployMain val={} ", v.val),
        Some(cmd::command::Data::PowerDown(v)) => format!(
            "PowerDown board={:?} ",
            Node::try_from(v.board).unwrap_or(Node::Unspecified)
        ),
        Some(cmd::command::Data::RadioRateChange(v)) => format!("RadioRateChange rate={} ", v.rate),
        Some(cmd::command::Data::Ping(v)) => format!("Ping id={} ", v.id),
        Some(cmd::command::Data::Pong(v)) => format!("Pong id={} ", v.id),
        None => "<no data>".to_string(),
    };
    SentMessage {
        summary: format!("{:?} -> {:?}: {}", origin, target, details),
    }
}

pub fn summarize_received_bytes(bytes: &[u8]) -> SentMessage {
    // Only decode as RadioFrame, do not attempt legacy message handling
    match RadioFrame::decode_length_delimited(bytes) {
        Ok(frame) => {
            let origin = Node::try_from(frame.node).unwrap_or(Node::Unspecified);
            debug!("Successfully decoded RadioFrame from node={:?}", origin);
            match frame.payload {
                Some(radio::radio_frame::Payload::Sbg(sbg)) => {
                    if let Some(inner) = &sbg.data {
                        let kind = match inner {
                            sbg_data::Data::GpsPos(_) => "SbgGpsPos",
                            sbg_data::Data::UtcTime(_) => "SbgUtcTime",
                            sbg_data::Data::Imu(_) => "SbgImu",
                            sbg_data::Data::EkfQuat(_) => "SbgEkfQuat",
                            sbg_data::Data::EkfNav(_) => "SbgEkfNav",
                            sbg_data::Data::GpsVel(_) => "SbgGpsVel",
                            sbg_data::Data::Air(_) => "SbgAir",
                        };
                        return SentMessage {
                            summary: format!("RadioFrame Sbg {} from node={:?}", kind, origin),
                        };
                    }
                    return SentMessage {
                        summary: format!("RadioFrame Sbg <no data> from node={:?}", origin),
                    };
                }
                Some(radio::radio_frame::Payload::Gps(gps)) => {
                    return SentMessage {
                        summary: format!(
                            "RadioFrame Gps type={} from node={:?}",
                            gps.message_type, origin
                        ),
                    };
                }
                Some(radio::radio_frame::Payload::Madgwick(_m)) => {
                    return SentMessage {
                        summary: format!("RadioFrame Madgwick from node={:?}", origin),
                    };
                }
                Some(radio::radio_frame::Payload::Iim20670(_m)) => {
                    return SentMessage {
                        summary: format!("RadioFrame Imu(IIM20670) from node={:?}", origin),
                    };
                }
                Some(radio::radio_frame::Payload::Log(_m)) => {
                    return SentMessage {
                        summary: format!("RadioFrame Log from node={:?}", origin),
                    };
                }
                Some(radio::radio_frame::Payload::State(_m)) => {
                    return SentMessage {
                        summary: format!("RadioFrame State from node={:?}", origin),
                    };
                }
                Some(radio::radio_frame::Payload::Command(m)) => {
                    let detail = match m.data.as_ref() {
                        Some(cmd::command::Data::Ping(v)) => format!("Ping id={}", v.id),
                        Some(cmd::command::Data::Pong(v)) => format!("Pong id={}", v.id),
                        Some(cmd::command::Data::Online(v)) => {
                            format!("Online online={}", v.online)
                        }
                        Some(cmd::command::Data::DeployDrogue(v)) => {
                            format!("DeployDrogue val={}", v.val)
                        }
                        Some(cmd::command::Data::DeployMain(v)) => {
                            format!("DeployMain val={}", v.val)
                        }
                        Some(cmd::command::Data::PowerDown(v)) => format!(
                            "PowerDown board={:?}",
                            Node::try_from(v.board).unwrap_or(Node::Unspecified)
                        ),
                        Some(cmd::command::Data::RadioRateChange(v)) => {
                            format!("RadioRateChange rate={}", v.rate)
                        }
                        None => "<no data>".to_string(),
                    };
                    return SentMessage {
                        summary: format!("RadioFrame Command from node={:?}: {}", origin, detail),
                    };
                }
                None => {
                    return SentMessage {
                        summary: format!("RadioFrame <no payload> from node={:?}", origin),
                    };
                }
            }
        }
        Err(radio_err) => {
            warn!(
                "RadioFrame decode failed: {}. Buffer: {:02x?}",
                radio_err, bytes
            );
        }
    }

    SentMessage {
        summary: format!("Unknown/Failed decode ({} bytes)", bytes.len()),
    }
}
