use crate::processing::ProcessedMessage;
use log::{debug, info};
use mavlink::uorocketry::RADIO_STATUS_DATA;
use mavlink::MavHeader;
use serde::{Deserialize, Serialize};
use std::sync::mpsc::{Receiver, Sender};
use std::time::{Duration, Instant};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub struct LinkStatus {
    recent_error_rate: f32,
    missed_messages: u32,
}

#[derive(Clone, Debug)]
pub enum RadioData {
    RadioStatus(RADIO_STATUS_DATA),
    MavlinkHeader(MavHeader),
}

#[derive(Clone, Debug)]
struct MessageStats {
    time: Instant,
    missed_messages: u8,
}

#[derive(Clone, Debug)]
pub struct RadioStatus {
    stats_period: Duration,
    stats_window: Duration,
    last_messages: Vec<MessageStats>,
    total_missed_messages: u32,
    last_sequence: Option<u8>,
    last_mav_status: Option<RADIO_STATUS_DATA>,
    last_mav_status_instant: Instant,
}

impl RadioStatus {
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
        }
    }

    pub fn process_loop(&mut self, rcv: Receiver<RadioData>, send: Sender<ProcessedMessage>) -> ! {
        info!("Starting to process radio status");
        let mut previous_update = Instant::now();

        loop {
            match rcv.recv_timeout(self.stats_period) {
                Ok(RadioData::MavlinkHeader(h)) => self.process_header(h),
                Ok(RadioData::RadioStatus(s)) => {
                    self.last_mav_status = Some(s);
                    self.last_mav_status_instant = Instant::now();
                }
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
        let missed_messages = match self.last_sequence {
            None => 0,
            Some(last_sequence) => {
                match (header.sequence as i32 - last_sequence as i32).rem_euclid(u8::MAX as i32)
                    as u8
                {
                    0 => 0,
                    r => r - 1,
                }
            }
        };

        self.last_messages.push(MessageStats {
            time: Instant::now(),
            missed_messages,
        });
        self.last_sequence = Some(header.sequence);
        self.total_missed_messages += missed_messages as u32;
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

        let msg = ProcessedMessage::LinkStatus(LinkStatus {
            missed_messages: self.total_missed_messages,
            recent_error_rate: missed_count as f32 / total_msg_count as f32,
        });

        debug! {"Radio Status: {:?}", msg}

        send.send(msg).unwrap();
    }
}

#[cfg(test)]
mod test {
    use crate::processing::ProcessedMessage;
    use crate::processing::{RadioData, RadioStatus};
    use mavlink::MavHeader;
    use std::sync::mpsc;
    use std::thread;
    use std::time::Duration;

    fn create_mavheader(sequence: u8) -> RadioData {
        RadioData::MavlinkHeader(MavHeader {
            system_id: 0,
            component_id: 0,
            sequence,
        })
    }

    #[test]
    fn radio_status_missed_message() -> anyhow::Result<()> {
        let mut radio_status =
            RadioStatus::new_with_duration(Duration::from_millis(500), Duration::from_secs(5));
        let (data_send, data_rcv) = mpsc::channel();
        let (processed_send, processed_receive) = mpsc::channel();

        thread::spawn(move || radio_status.process_loop(data_rcv, processed_send));

        data_send.send(create_mavheader(240))?;
        data_send.send(create_mavheader(241))?;
        data_send.send(create_mavheader(250))?;
        data_send.send(create_mavheader(5))?;

        assert!(matches!(
            dbg!(processed_receive.recv().unwrap()),
            ProcessedMessage::LinkStatus(x) if x.missed_messages == 17 && x.recent_error_rate == 17.0/21.0
        ));

        Ok(())
    }

    #[test]
    fn radio_status_window() -> anyhow::Result<()> {
        let mut radio_status =
            RadioStatus::new_with_duration(Duration::from_millis(500), Duration::from_secs(2));
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
