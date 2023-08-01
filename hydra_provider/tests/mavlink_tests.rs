mod test_mavlink {
    use std::io::{BufRead, BufReader};
    use std::time::SystemTime;

    use anyhow::Ok;
    use log::info;
    use messages::mavlink;
    use messages::mavlink::uorocketry;
    use messages::sender::Sender;
    use messages::sensor::{Sensor, EkfQuat};
    use messages::Message;
    use postcard::{from_bytes, to_vec};
    use rand::Rng;

    pub const COMMON_MSG_HEADER: mavlink::MavHeader = mavlink::MavHeader {
        sequence: 42,
        system_id: 1,
        component_id: 1,
    };

    fn create_message() -> Message {
        let mut rng = rand::thread_rng();

         let ekf_quat = EkfQuat {
            euler_std_dev: [rng.gen(), rng.gen(), rng.gen()],
            quaternion: [
                rng.gen(),
                rng.gen(),
                rng.gen(),
                rng.gen(),
            ],
            status: rng.gen(),
            time_stamp: rng.gen(),
        };

        let time = fugit::Instant::<u64, 1, 1000>::from_ticks(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .expect("Time went backwards")
                .as_millis() as u64,
        );

        Message::new(&time, Sender::CommunicationBoard, Sensor::new(ekf_quat))
    }

    #[test]
    pub fn test_echo_message() {
        let mut v = vec![];
        let message = create_message();
        let payload = to_vec(&message).expect("Failed to serialize message");
        let payload_clone = payload.clone();
        let mav_msg = mavlink::uorocketry::MavMessage::POSTCARD_MESSAGE(
            mavlink::uorocketry::POSTCARD_MESSAGE_DATA { message: payload },
        );

        mavlink::write_v2_msg(&mut v, COMMON_MSG_HEADER, &mav_msg)
            .expect("Failed to write message");

        let mut data = v.as_slice();
        let (_header, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) =
            mavlink::read_v2_msg(&mut data).expect("Failed to read");

        match recv_msg {
            uorocketry::MavMessage::POSTCARD_MESSAGE(mut data) => {
                let mut i = 0;
                while i < data.message.len() - 2 {
                    if data.message[i] == 0 && data.message[i + 1] == 0 && data.message[i + 2] == 0
                    {
                        data.message.remove(i);
                    } else {
                        i += 1;
                    }
                    if i == data.message.len() - 2 {
                        data.message.remove(i);
                        data.message.remove(i);
                    }
                }
                println!("{:?}", data.message);
                assert_eq!(data.message, payload_clone)
            }
            _ => {
                panic!("Wrong message type")
            }
        }
    }

    #[test]
    #[ignore]
    pub fn read_radio_message() -> anyhow::Result<()> {
        let radio_msg =
            std::fs::File::open("tests/radio_message.txt").expect("Failed to open file");
        let mut v = vec![];
        let mut reader: Box<dyn BufRead> = Box::new(BufReader::new(radio_msg));
        reader.read_until(0x0, &mut v)?;
        let mut v = v.as_slice();

        println!("{:?}", v);

        let (_header, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) =
            mavlink::read_v2_msg(&mut v)?;

        match recv_msg {
            uorocketry::MavMessage::POSTCARD_MESSAGE(data) => {
                let msg: Message = from_bytes(data.message.as_slice())?;
                info!("received: {:#?}", msg);
                Ok(())
            }
            _ => Err(anyhow::anyhow!("error: {:#?}", "wrong message type")),
        }
    }
}
