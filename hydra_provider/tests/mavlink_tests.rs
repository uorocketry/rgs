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
            accel_x: rng.gen(),
            accel_y: rng.gen(),
            accel_z: rng.gen(),
            velocity_n: rng.gen(),
            velocity_e: rng.gen(),
            pressure: rng.gen(),
            height: rng.gen(),
            roll: rng.gen(),
            yaw: rng.gen(),
            pitch: rng.gen(),
            latitude: rng.gen(),
            longitude: rng.gen(),
            quant_w: rng.gen(),
            quant_x: rng.gen(),
            quant_y: rng.gen(),
            velocity_d: rng.gen(),
            quant_z: rng.gen(),
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
            uorocketry::MavMessage::POSTCARD_MESSAGE(mut data) => {
                let mut i=0;
                while i < data.message.len()-2 {
                    if data.message[i]==0 && data.message[i+1]==0 && data.message[i+2]==0{
                        data.message.remove(i);
                    }
                    else {
                        i+=1;
                    }
                    if i==data.message.len()-2 {
                        data.message.remove(i);
                        data.message.remove(i);
                    }
                }
                assert_eq!(data.message, payload_clone)
            }
            _ => {
                panic!("Wrong message type")
            }
        }
        
    }
}