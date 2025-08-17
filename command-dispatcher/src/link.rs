use chrono::Utc;
use libsql::{params as libsql_params, Connection};
use mavlink::{uorocketry::MavMessage, MavConnection, MavHeader};
use messages_prost::command as cmd;
use messages_prost::common::Node;
use messages_prost::radio::radio_frame::Payload;
use messages_prost::radio::RadioFrame;
use prost::Message as _;
use std::collections::HashMap;
use std::time::{Duration, Instant};
use tracing::warn;

pub struct LinkMonitor {
    inflight: HashMap<u32, Instant>,
    last_ping_at: Instant,
    next_ping_id: u32,
    service_instance_id: String,
    service_name: String,
    hostname: String,
}

impl LinkMonitor {
    pub fn new(service_instance_id: String, service_name: String, hostname: String) -> Self {
        // make first ping fire immediately
        Self {
            inflight: HashMap::new(),
            last_ping_at: Instant::now() - Duration::from_secs(5),
            next_ping_id: 1,
            service_instance_id,
            service_name,
            hostname,
        }
    }

    pub async fn tick(
        &mut self,
        conn: &mut (dyn MavConnection<MavMessage> + Send + Sync),
        db_conn: &Connection,
    ) {
        // Send periodic ping
        if self.last_ping_at.elapsed() >= Duration::from_secs(5) {
            let id = self.next_ping_id;
            self.next_ping_id = self.next_ping_id.wrapping_add(1);
            self.last_ping_at = Instant::now();
            self.inflight.insert(id, self.last_ping_at);

            let command = cmd::Command {
                node: Node::PressureBoard as i32,
                data: Some(cmd::command::Data::Ping(cmd::Ping { id })),
            };
            let frame = RadioFrame { node: Node::GroundStation as i32, payload: Some(Payload::Command(command)), millis_since_start: self.last_ping_at.elapsed().as_millis() as u64 };
            let bytes = RadioFrame::encode_length_delimited_to_vec(&frame);
            let mut fixed = [0u8; 255];
            let len = bytes.len().min(255);
            fixed[..len].copy_from_slice(&bytes[..len]);
            let msg = MavMessage::POSTCARD_MESSAGE(mavlink::uorocketry::POSTCARD_MESSAGE_DATA { message: fixed });
            if let Err(e) = conn.send(&MavHeader::default(), &msg) {
                warn!("Link ping send failed: {}", e);
            }
        }

        // Drain a few incoming frames to catch Pong
        for _ in 0..8 {
            match conn.recv() {
                Ok((_hdr, message)) => match message {
                    MavMessage::POSTCARD_MESSAGE(data) => {
                        if let Ok(frame) = RadioFrame::decode_length_delimited(&data.message[..]) {
                            if let Some(Payload::Command(c)) = frame.payload {
                                if let Some(cmd::command::Data::Pong(p)) = c.data {
                                    if let Some(sent_at) = self.inflight.remove(&p.id) {
                                        let rtt_ms = sent_at.elapsed().as_millis() as i64;
                                        let now_ts = Utc::now().timestamp();
                                        let msg = format!(
                                            "Running (link ok; rtt={}ms @ {})",
                                            rtt_ms, now_ts
                                        );
                                        if let Err(e) = db_conn
                                            .execute(
                                                "INSERT INTO ServiceStatus (service_instance_id, service_name, hostname, status, status_message, last_heartbeat_at, start_time) VALUES (?1, ?2, ?3, ?4, ?5, ?6, COALESCE((SELECT start_time FROM ServiceStatus WHERE service_instance_id=?1), ?6)) \
                                                 ON CONFLICT(service_instance_id) DO UPDATE SET status=excluded.status, status_message=excluded.status_message, last_heartbeat_at=excluded.last_heartbeat_at",
                                                libsql_params![
                                                    self.service_instance_id.as_str(),
                                                    self.service_name.as_str(),
                                                    self.hostname.as_str(),
                                                    "Running",
                                                    msg,
                                                    now_ts,
                                                    now_ts,
                                                ],
                                            )
                                            .await
                                        {
                                            warn!(
                                                "Failed to update ServiceStatus with RTT: {}",
                                                e
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                    _ => {}
                },
                Err(mavlink::error::MessageReadError::Io(io_err))
                    if io_err.kind() == std::io::ErrorKind::WouldBlock =>
                {
                    break;
                }
                Err(e) => {
                    warn!("Link recv error: {}", e);
                    break;
                }
            }
        }
    }
}


