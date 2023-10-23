use crate::processing::ProcessedMessage;
use anyhow::Result;
use messages::{sensor::Sensor, Message};
use serde::{Deserialize, Serialize};
use serde_json::Value;

fn merge(a: &mut Value, b: &Value) {
    match (a, b) {
        (&mut Value::Object(ref mut a), &Value::Object(ref b)) => {
            for (k, v) in b {
                merge(a.entry(k.clone()).or_insert(Value::Null), v);
            }
        }
        (a, b) => {
            *a = b.clone();
        }
    }
}

#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateResponse {
    collectionId: String,
    collectionName: String,
    id: String,
}

pub struct PBClient {
    base_url: String,
    token: String,
}

impl PBClient {
    pub fn new(port: u32) -> Self {
        // TODO: Use env variables for this
        let base_url = format!("http://localhost:{}", port);
        let url = format!("{}/api/admins/auth-with-password", base_url);
        let body = serde_json::json!({
            "identity": "admin@admin.com",
            "password": "admin"
        });

        let req = reqwest::blocking::Client::new()
            .post(&url)
            .json(&body)
            .send()
            .unwrap();
        let resp_json: Value = serde_json::from_str(req.text().unwrap().as_str()).unwrap();
        let token = resp_json.get("token").unwrap().as_str().unwrap();
        println!("Auth Token {}", token);
        PBClient {
            token: token.to_string(),
            base_url: base_url.to_string(),
        }
    }

    pub fn create<T>(&self, collection: &str, body: &T) -> CreateResponse
    where
        T: Serialize + ?Sized + std::fmt::Debug,
    {
        let url = format!("{}/api/collections/{}/records", self.base_url, collection);
        let req = reqwest::blocking::Client::new()
            .post(&url)
            .json(&body)
            .bearer_auth(self.token.as_str())
            .send()
            .unwrap();

        let status = &req.status();
        let resp_json: Value = req.json().unwrap();

        match status.is_success() {
            true => {}
            false => {
                let bodyStr = serde_json::to_string(body).unwrap();
                println!("Collection: {}", collection);
                println!("Body: {:?}", bodyStr);
                println!("Response: {:?}", &resp_json.to_string());
                panic!("Error creating rocket message")
            }
        }
        return serde_json::from_value(resp_json.clone()).unwrap();
    }

    pub fn create_rocket_message(&self, msg: &Message, discriminator: &str) -> CreateResponse {
        return self.create(
            "rocket_message",
            &serde_json::json!({
                "timestamp": msg.timestamp,
                "sender": msg.sender,
                "discriminator": discriminator
            }),
        );
    }

    pub fn create_sensor(
        &self,
        parent_id: &str,
        component_id: u8,
        sensor_data: &messages::sensor::SensorData,
        discriminator: &str,
    ) {
        let sensor_msg = self.create(
            "rocket_sensor",
            &serde_json::json!({
                "parent": parent_id,
                "discriminator": discriminator,
                "component_id": component_id
            }),
        );

        let mut sensor_data_msg = serde_json::to_value(&sensor_data).unwrap();
        let mut sensor_data_msg_mut = sensor_data_msg.clone();

        let key = sensor_data_msg.as_object().unwrap().keys().next().unwrap();
        let msg_inner = sensor_data_msg_mut
            .as_object_mut()
            .unwrap()
            .get_mut(key)
            .unwrap();

        // let msg_inner = sensor_data_msg.get_mut(key).unwrap();
        merge(
            msg_inner,
            &serde_json::json!({
                "parent": sensor_msg.id
            }),
        );

        self.create(discriminator, msg_inner);
    }

    pub fn create_rocket_sensor(&self, sensor: &Sensor, parent_id: &str) {
        let discriminator = match &sensor.data {
            messages::sensor::SensorData::UtcTime(_) => "rocket_time",
            messages::sensor::SensorData::Air(_) => "rocket_air",
            messages::sensor::SensorData::EkfQuat(r) => "rocket_quat",
            messages::sensor::SensorData::EkfNav1(_) => "rocket_nav1",
            messages::sensor::SensorData::EkfNav2(_) => "rocket_nav2",
            messages::sensor::SensorData::Imu1(_) => "rocket_imu1",
            messages::sensor::SensorData::Imu2(_) => "rocket_imu2",
            messages::sensor::SensorData::GpsVel(_) => "rocket_vel",
            messages::sensor::SensorData::GpsPos1(_) => "rocket_pos1",
            messages::sensor::SensorData::GpsPos2(_) => "rocket_pos2",
            messages::sensor::SensorData::Current(_) => "rocket_current",
            messages::sensor::SensorData::Voltage(_) => "rocket_voltage",
            messages::sensor::SensorData::Regulator(_) => "rocket_regulator",
            messages::sensor::SensorData::Temperature(_) => "rocket_temperature",
        };

        self.create_sensor(parent_id, sensor.component_id, &sensor.data, discriminator);
    }

    pub fn send(&self, msg: &ProcessedMessage) -> Result<()> {
        match msg {
            ProcessedMessage::RocketMessage(rocket_message) => match &rocket_message.data {
                messages::Data::State(state) => {
                    let parent_msg = self.create_rocket_message(rocket_message, "rocket_state");
                    self.create(
                        "rocket_state",
                        &serde_json::json!({
                            "parent": parent_msg.id,
                            "state": state.data
                        }),
                    );
                }
                messages::Data::Sensor(sensor) => {
                    let parent_msg = self.create_rocket_message(rocket_message, "rocket_sensor");
                    // TODO: Normalize data
                    self.create_rocket_sensor(sensor, &parent_msg.id);
                }

                messages::Data::Log(log_msg) => {
                    let parent_msg = self.create_rocket_message(rocket_message, "rocket_log");
                    let log_msg_json = serde_json::to_value(log_msg).unwrap();

                    // TODO: Maybe normalize the event?
                    // not sure how events work
                    self.create(
                        "rocket_log",
                        &serde_json::json!({
                            "parent": parent_msg.id,
                            "level": log_msg_json.get("level").unwrap(),
                            "event": log_msg_json.get("event").unwrap()
                        }),
                    );
                }
                messages::Data::Command(command_msg) => {
                    let parent_msg = self.create_rocket_message(rocket_message, "rocket_command");

                    self.create(
                        "rocket_command",
                        &serde_json::json!({
                            "parent": parent_msg.id,
                            "data": command_msg.data
                        }),
                    );
                }
            },
            ProcessedMessage::LinkStatus(link_status) => {
                self.create("rocket_link", link_status);
            }
        }
        Ok(())
    }
}
