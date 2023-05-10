use crate::processing::ProcessedMessage;
use log::{debug, info};
use messages::mavlink::uorocketry::RADIO_STATUS_DATA;
use messages::mavlink::MavHeader;
use serde::{Deserialize, Serialize};
use std::sync::mpsc::{Receiver, Sender};
use std::time::{Duration, Instant};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct LinkStatus {
    pub rssi: Option<u8>,
    pub remrssi: Option<u8>,
    pub txbuf: Option<u8>,
    pub noise: Option<u8>,
    pub remnoise: Option<u8>,
    pub rxerrors: Option<u16>,
    pub fixed: Option<u16>,
    pub recent_error_rate: f32,
    pub missed_messages: u32,
    pub connected: bool,
}

#[derive(Clone, Debug)]
pub enum LinkData {
    RadioStatus(RADIO_STATUS_DATA),
    MavlinkHeader(MavHeader),
    MavlinkHeartbeat(),
}

#[derive(Clone, Debug)]
struct MessageStats {
    time: Instant,
    missed_messages: u8,
}

#[derive(Clone, Debug)]
pub struct LinkStatusProcessing {
    stats_period: Duration,
    stats_window: Duration,
    last_messages: Vec<MessageStats>,
    total_missed_messages: u32,
    last_sequence: Option<u8>,
    last_mav_status: Option<RADIO_STATUS_DATA>,
    last_mav_status_instant: Instant,
    last_hearbeat: Instant,
}

impl LinkStatusProcessing {
    pub fn new() -> Self {
        Self::new_with_duration(Duration::from_secs(5), Duration::from_secs(60))
    }

    pub fn new_with_duration(stats_period: Duration, stats_window: Duration) -> Self {
        Self {
            last_messages: vec![],
            total_missed_messages: 0,
            last_sequence: None,
            stats_period,
            stats_window,
            last_mav_status: None,
            last_mav_status_instant: Instant::now(),
            last_hearbeat: Instant::now(),
        }
    }

    pub fn process_loop(&mut self, rcv: Receiver<LinkData>, send: Sender<ProcessedMessage>) -> ! {
        info!("Starting to process radio status");
        let mut previous_update = Instant::now();

        loop {
            match rcv.recv_timeout(self.stats_period) {
                Ok(LinkData::MavlinkHeader(h)) => self.process_header(h),
                Ok(LinkData::RadioStatus(s)) => {
                    self.last_mav_status = Some(s);
                    self.last_mav_status_instant = Instant::now();
                }
                Ok(LinkData::MavlinkHeartbeat()) => self.last_hearbeat = Instant::now(),
                _ => {}
            };

            if Instant::now() - self.last_mav_status_instant > Duration::from_secs(20) {
                self.last_mav_status = None
            }

            if Instant::now() - previous_update > self.stats_period {
                self.send_stats(&send);
                previous_update = Instant::now();
            }
        }
    }

    fn process_header(&mut self, header: MavHeader) {
        // Use modulo arithmetic (rem_euclid) to calculate the missed messages.
        let missed_messages = match self.last_sequence {
            None => 0,
            Some(last_sequence) => {
                (header.sequence as i32 - last_sequence as i32 - 1).rem_euclid(u8::MAX as i32) as u8
            }
        };

        self.last_messages.push(MessageStats {
            time: Instant::now(),
            missed_messages,
        });
        self.last_sequence = Some(header.sequence);
        self.total_missed_messages += missed_messages as u32;

        // TODO: Remove this and use actual heartbeats once they are sent
        self.last_hearbeat = Instant::now();
    }

    fn send_stats(&mut self, send: &Sender<ProcessedMessage>) {
        self.last_messages
            .retain(|x| Instant::now() - x.time < self.stats_window);

        let missed_count: u32 = self
            .last_messages
            .iter()
            .map(|x| x.missed_messages as u32)
            .sum();
        let total_msg_count = self.last_messages.len() as u32 + missed_count;

        let missed_messages = self.total_missed_messages;
        let recent_error_rate = missed_count as f32 / total_msg_count as f32;
        let connected = Instant::now() - self.last_hearbeat < Duration::from_secs(20);

        let msg = match &self.last_mav_status {
            None => ProcessedMessage::LinkStatus(LinkStatus {
                rssi: None,
                remrssi: None,
                txbuf: None,
                noise: None,
                remnoise: None,
                rxerrors: None,
                fixed: None,
                missed_messages,
                recent_error_rate,
                connected,
            }),
            Some(status) => ProcessedMessage::LinkStatus(LinkStatus {
                rssi: Some(status.rssi),
                remrssi: Some(status.remrssi),
                txbuf: Some(status.txbuf),
                noise: Some(status.noise),
                remnoise: Some(status.remnoise),
                rxerrors: Some(status.rxerrors),
                fixed: Some(status.fixed),
                missed_messages,
                recent_error_rate,
                connected,
            }),
        };

        debug!("Link Status: {:?}", msg);

        send.send(msg).unwrap();
    }
}

#[cfg(test)]
mod test {
    use crate::processing::link_status::LinkStatusProcessing;
    use crate::processing::LinkData;
    use crate::processing::ProcessedMessage;
    use messages::mavlink::MavHeader;
    use std::sync::mpsc;
    use std::thread;
    use std::time::Duration;

    fn create_mavheader(sequence: u8) -> LinkData {
        LinkData::MavlinkHeader(MavHeader {
            system_id: 0,
            component_id: 0,
            sequence,
        })
    }

    #[test]
    fn radio_status_missed_message() -> anyhow::Result<()> {
        let mut radio_status = LinkStatusProcessing::new_with_duration(
            Duration::from_millis(500),
            Duration::from_secs(5),
        );
        let (data_send, data_rcv) = mpsc::channel();
        let (processed_send, processed_receive) = mpsc::channel();

        thread::spawn(move || radio_status.process_loop(data_rcv, processed_send));

        data_send.send(create_mavheader(240))?;
        data_send.send(create_mavheader(241))?;
        data_send.send(create_mavheader(250))?;
        data_send.send(create_mavheader(5))?;
        data_send.send(create_mavheader(5))?;

        assert!(matches!(
            dbg!(processed_receive.recv().unwrap()),
            ProcessedMessage::LinkStatus(x) if x.missed_messages == 271 && x.recent_error_rate == 271.0/276.0
        ));

        Ok(())
    }

    #[test]
    fn radio_status_window() -> anyhow::Result<()> {
        let mut radio_status = LinkStatusProcessing::new_with_duration(
            Duration::from_millis(500),
            Duration::from_secs(2),
        );
        let (data_send, data_rcv) = mpsc::channel();
        let (processed_send, processed_receive) = mpsc::channel();

        thread::spawn(move || radio_status.process_loop(data_rcv, processed_send));

        data_send.send(create_mavheader(240))?;
        data_send.send(create_mavheader(241))?;
        data_send.send(create_mavheader(250))?;
        data_send.send(create_mavheader(5))?;

        thread::sleep(Duration::from_secs(3));

        // Flush all the messages we received
        loop {
            if processed_receive.try_recv().is_err() {
                break;
            }
        }

        assert!(matches!(
            dbg!(processed_receive.recv().unwrap()),
            ProcessedMessage::LinkStatus(x) if x.recent_error_rate.is_nan()
        ));

        Ok(())
    }
}
