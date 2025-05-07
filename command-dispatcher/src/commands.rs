use chrono::Utc;
use libsql::{params as libsql_params, Connection};
use mavlink::{uorocketry::MavMessage, MavConnection, MavHeader};
use messages::{
    command::{
        Command as RgsCommand, DeployDrogue as RgsDeployDrogue, DeployMain as RgsDeployMain,
        Online as RgsOnline, PowerDown as RgsPowerDown, RadioRate as RgsRadioRate,
        RadioRateChange as RgsRadioRateChange,
    },
    node::Node,
    FormattedNaiveDateTime,
};
use serde::Deserialize;
use serde_json;
use tracing::{error, info};

// Struct to represent a row from the OutgoingCommand table
#[derive(Debug)]
pub struct OutgoingCommandRow {
    pub id: i64,
    pub command_type: String,
    pub parameters: Option<String>,
    pub source_service: String,
}

// Parameter structs for deserialization
#[derive(Deserialize, Debug)]
struct DeployDrogueParams {
    val: bool,
}
#[derive(Deserialize, Debug)]
struct DeployMainParams {
    val: bool,
}
#[derive(Deserialize, Debug)]
struct PowerDownParams {
    board: String,
}
#[derive(Deserialize, Debug)]
struct RadioRateChangeParams {
    rate: String,
}

pub async fn process_single_command(
    db_conn: &Connection,
    gateway_conn: &mut Box<dyn MavConnection<MavMessage> + Sync + Send>,
    command_row: OutgoingCommandRow,
) -> Result<(), (i64, Box<dyn std::error::Error>)> {
    let cmd_id = command_row.id;
    info!(
        "[Cmd ID: {}] Processing command of type '{}' from '{}'. Params: {:?}",
        cmd_id, command_row.command_type, command_row.source_service, command_row.parameters
    );

    let queued_at_ts = Utc::now().timestamp();
    db_conn.execute(
        "UPDATE OutgoingCommand SET status = 'Sending', queued_at = ?, attempts = attempts + 1 WHERE id = ?",
        libsql_params![queued_at_ts, cmd_id],
    ).await.map_err(|e| (cmd_id, e.into()))?;
    info!("[Cmd ID: {}] Marked as 'Sending'.", cmd_id);

    let command_payload = match command_row.command_type.as_str() {
        "DeployDrogue" => {
            let params: DeployDrogueParams =
                serde_json::from_str(command_row.parameters.as_deref().unwrap_or("{}"))
                    .map_err(|e| (cmd_id, Box::new(e) as Box<dyn std::error::Error>))?;
            RgsCommand::DeployDrogue(RgsDeployDrogue { val: params.val })
        }
        "DeployMain" => {
            let params: DeployMainParams =
                serde_json::from_str(command_row.parameters.as_deref().unwrap_or("{}"))
                    .map_err(|e| (cmd_id, Box::new(e) as Box<dyn std::error::Error>))?;
            RgsCommand::DeployMain(RgsDeployMain { val: params.val })
        }
        "PowerDown" => {
            let params_str = command_row.parameters.as_deref().ok_or_else(|| {
                (
                    cmd_id,
                    Box::new(std::io::Error::new(
                        std::io::ErrorKind::InvalidInput,
                        "Missing parameters for PowerDown",
                    )) as Box<dyn std::error::Error>,
                )
            })?;
            let params: PowerDownParams = serde_json::from_str(params_str)
                .map_err(|e| (cmd_id, Box::new(e) as Box<dyn std::error::Error>))?;
            match params.board.as_str() {
                "PressureBoard" => RgsCommand::PowerDown(RgsPowerDown {
                    board: Node::PressureBoard,
                }),
                "StrainBoard" => RgsCommand::PowerDown(RgsPowerDown {
                    board: Node::StrainBoard,
                }),
                "TemperatureBoard" => RgsCommand::PowerDown(RgsPowerDown {
                    board: Node::TemperatureBoard,
                }),
                _ => {
                    return Err((
                        cmd_id,
                        Box::new(std::io::Error::new(
                            std::io::ErrorKind::InvalidInput,
                            format!("Invalid board name: {}", params.board),
                        )),
                    ))
                }
            }
        }
        "RadioRateChange" => {
            let params_str = command_row.parameters.as_deref().ok_or_else(|| {
                (
                    cmd_id,
                    Box::new(std::io::Error::new(
                        std::io::ErrorKind::InvalidInput,
                        "Missing parameters for RadioRateChange",
                    )) as Box<dyn std::error::Error>,
                )
            })?;
            let params: RadioRateChangeParams = serde_json::from_str(params_str)
                .map_err(|e| (cmd_id, Box::new(e) as Box<dyn std::error::Error>))?;
            match params.rate.as_str() {
                "Fast" => RgsCommand::RadioRateChange(RgsRadioRateChange {
                    rate: RgsRadioRate::Fast,
                }),
                "Slow" => RgsCommand::RadioRateChange(RgsRadioRateChange {
                    rate: RgsRadioRate::Slow,
                }),
                _ => {
                    return Err((
                        cmd_id,
                        Box::new(std::io::Error::new(
                            std::io::ErrorKind::InvalidInput,
                            format!("Invalid radio rate: {}", params.rate),
                        )),
                    ))
                }
            }
        }
        "Ping" => RgsCommand::Online(RgsOnline { online: true }),
        _ => {
            let err_msg = format!("Unknown command type: {}", command_row.command_type);
            error!("[Cmd ID: {}] {}", cmd_id, err_msg);
            db_conn.execute(
                "UPDATE OutgoingCommand SET status = 'Failed', sent_at = ?, error_message = ? WHERE id = ?",
                libsql_params![Utc::now().timestamp(), err_msg.clone(), cmd_id],
            ).await.map_err(|e| (cmd_id, e.into()))?;
            return Err((cmd_id, err_msg.into()));
        }
    };

    let radio_msg = messages::RadioMessage::new(
        FormattedNaiveDateTime(Utc::now().naive_utc()),
        Node::PressureBoard,
        messages::Common::Command(command_payload),
    );

    let mut buf = [0u8; 255];
    let postcard_data = postcard::to_slice(&radio_msg, &mut buf)
        .map_err(|e| (cmd_id, Box::new(e) as Box<dyn std::error::Error>))?;

    let mut fixed_payload = [0u8; 255];
    let len = postcard_data.len().min(255);
    fixed_payload[..len].copy_from_slice(&postcard_data[..len]);
    let send_msg = MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA {
        message: fixed_payload,
    });

    info!("[Cmd ID: {}] Sending MAVLink message...", cmd_id);
    match gateway_conn.send(&MavHeader::default(), &send_msg) {
        Ok(_) => {
            info!(
                "[Cmd ID: {}] Successfully sent. Updating status to 'Sent'.",
                cmd_id
            );
            db_conn
                .execute(
                    "UPDATE OutgoingCommand SET status = 'Sent', sent_at = ? WHERE id = ?",
                    libsql_params![Utc::now().timestamp(), cmd_id],
                )
                .await
                .map_err(|e| (cmd_id, e.into()))?;
            Ok(())
        }
        Err(mav_err) => {
            let err_msg = format!("Failed to send MAVLink message: {}", mav_err);
            error!("[Cmd ID: {}] {}", cmd_id, err_msg);
            db_conn.execute(
                "UPDATE OutgoingCommand SET status = 'Failed', sent_at = ?, error_message = ? WHERE id = ?",
                libsql_params![Utc::now().timestamp(), err_msg.clone(), cmd_id],
            ).await.map_err(|e_db| (cmd_id, e_db.into()))?;
            Err((cmd_id, mav_err.into()))
        }
    }
}
