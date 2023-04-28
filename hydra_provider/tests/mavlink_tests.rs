mod test_mavlink {
    use std::time::SystemTime;

    use mavlink::{uorocketry};
    use postcard::to_vec; 
    use messages::sender::Sender;
    use messages::sensor::{Sbg, Sensor};
    use messages::Message;
    use rand::Rng;

    pub const COMMON_MSG_HEADER: mavlink::MavHeader = mavlink::MavHeader {
        sequence: 42,
        system_id: 1,
        component_id: 1,
    };

    fn create_message() -> Message {

        let mut rng = rand::thread_rng();

        let sbg = Sbg {
            accel: rng.gen(),
            speed: rng.gen(),
            pressure: rng.gen(),
            height: rng.gen(),
        };

        let time = fugit::Instant::<u64, 1, 1000>::from_ticks(
            SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH).expect("Time went backwards")
                .as_millis() as u64,
        );
        let msg = Message::new(&time, Sender::MainBoard, Sensor::new(0, sbg));
        
        return msg;
    }

    #[test]
    pub fn test_echo_message(){
        let mut v = vec![];
        let message = create_message();
        let payload = to_vec(&message).expect("Failed to serialize message");
        let payload_clone = payload.clone();
        let mav_msg = mavlink::uorocketry::MavMessage::POSTCARD_MESSAGE(
            mavlink::uorocketry::POSTCARD_MESSAGE_DATA{
                message: payload,
            }
        );

        mavlink::write_v2_msg(
            &mut v,
            COMMON_MSG_HEADER,
            &mav_msg,
        )
        .expect("Failed to write message");
        
        let mut data = v.as_slice();
        let (_header, recv_msg): (mavlink::MavHeader, uorocketry::MavMessage) =
            mavlink::read_v2_msg(&mut data).expect("Failed to read");

        match recv_msg {
            uorocketry::MavMessage::POSTCARD_MESSAGE(data) => {
                assert_eq!(data.message, payload_clone)
            }
            _ => {
                panic!("Wrong message type")
            }
        }
        
    }
}