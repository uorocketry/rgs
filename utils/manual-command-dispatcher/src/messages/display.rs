use messages_prost::command as cmd;
use messages_prost::common::Node;
use messages_prost::log::Log;
use messages_prost::sensor::{
    gps::Gps,
    iim20670::Imu,
    madgwick::Madgwick,
    sbg::{sbg_data, SbgMessage},
};
use messages_prost::state::StateMessage;
use prost::Message as _;

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
    if let Ok(msg) = SbgMessage::decode(bytes) {
        if let Some(data) = &msg.data {
            let kind = match data.data.as_ref() {
                Some(sbg_data::Data::GpsPos(_)) => "SbgGpsPos",
                Some(sbg_data::Data::UtcTime(_)) => "SbgUtcTime",
                Some(sbg_data::Data::Imu(_)) => "SbgImu",
                Some(sbg_data::Data::EkfQuat(_)) => "SbgEkfQuat",
                Some(sbg_data::Data::EkfNav(_)) => "SbgEkfNav",
                Some(sbg_data::Data::GpsVel(_)) => "SbgGpsVel",
                Some(sbg_data::Data::Air(_)) => "SbgAir",
                None => "Sbg<unknown>",
            };
            return SentMessage {
                summary: format!(
                    "Sbg {} from node={:?}",
                    kind,
                    Node::try_from(msg.node).unwrap_or(Node::Unspecified)
                ),
            };
        }
    } else if let Ok(msg) = Gps::decode(bytes) {
        return SentMessage {
            summary: format!(
                "Gps type={} from node={:?}",
                msg.message_type,
                Node::try_from(msg.node).unwrap_or(Node::Unspecified)
            ),
        };
    } else if let Ok(_msg) = Imu::decode(bytes) {
        return SentMessage {
            summary: "Imu".to_string(),
        };
    } else if let Ok(_msg) = Madgwick::decode(bytes) {
        return SentMessage {
            summary: "Madgwick".to_string(),
        };
    } else if let Ok(_msg) = Log::decode(bytes) {
        return SentMessage {
            summary: "Log".to_string(),
        };
    } else if let Ok(_msg) = StateMessage::decode(bytes) {
        return SentMessage {
            summary: "State".to_string(),
        };
    } else if let Ok(_msg) = cmd::Command::decode(bytes) {
        return SentMessage {
            summary: "Command".to_string(),
        };
    }

    SentMessage {
        summary: format!("Unknown/Failed decode ({} bytes)", bytes.len()),
    }
}
