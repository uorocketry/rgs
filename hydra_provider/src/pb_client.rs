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

        let resp_json: Value = req.json().unwrap();
        let rocket_message = serde_json::from_value(resp_json.clone());

        match rocket_message {
            Ok(rocket_message) => rocket_message,
            Err(e) => {
                println!("Collection: {}", collection);
                println!("Body: {:?}", &body);
                println!("Response: {:?}", &resp_json);
                println!("Error: {:?}", e);

                panic!("Error creating rocket message")
            }
        }
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

    pub fn create_rocket_sensor(&self, sensor: &Sensor, parent_id: &str) {
        match &sensor.data {
            messages::sensor::SensorData::UtcTime(time) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_time",
                        "component_id": sensor.component_id
                    }),
                );

                let mut utc_time = serde_json::to_value(time).unwrap();
                merge(
                    &mut utc_time,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_time", &utc_time);
            }
            messages::sensor::SensorData::Air(air_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_air",
                        "component_id": sensor.component_id
                    }),
                );

                let mut air = serde_json::to_value(air_msg).unwrap();
                merge(
                    &mut air,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_air", &air);
            }
            messages::sensor::SensorData::EkfQuat(quat_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_quat",
                        "component_id": sensor.component_id
                    }),
                );

                let mut ekf_quat = serde_json::to_value(quat_msg).unwrap();
                merge(
                    &mut ekf_quat,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_quat", &ekf_quat);
            }
            messages::sensor::SensorData::EkfNav1(nav1) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_nav1",
                        "component_id": sensor.component_id
                    }),
                );

                let mut ekf_nav1 = serde_json::to_value(nav1).unwrap();
                merge(
                    &mut ekf_nav1,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_nav1", &ekf_nav1);
            }
            messages::sensor::SensorData::EkfNav2(nav2) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_nav2",
                        "component_id": sensor.component_id
                    }),
                );

                let mut ekf_nav2 = serde_json::to_value(nav2).unwrap();
                merge(
                    &mut ekf_nav2,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_nav2", &ekf_nav2);
            }
            messages::sensor::SensorData::Imu1(imu1_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_imu1",
                        "component_id": sensor.component_id
                    }),
                );

                let mut imu1 = serde_json::to_value(imu1_msg).unwrap();

                merge(
                    &mut imu1,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_imu1", &imu1);
            }
            messages::sensor::SensorData::Imu2(imu2_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_imu2",
                        "component_id": sensor.component_id
                    }),
                );

                let mut imu2 = serde_json::to_value(imu2_msg).unwrap();
                merge(
                    &mut imu2,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_imu2", &imu2);
            }
            messages::sensor::SensorData::GpsVel(vel_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_vel",
                        "component_id": sensor.component_id
                    }),
                );

                let mut vel = serde_json::to_value(vel_msg).unwrap();
                merge(
                    &mut vel,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_vel", &vel);
            }
            messages::sensor::SensorData::GpsPos1(pos1_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_pos1",
                        "component_id": sensor.component_id
                    }),
                );

                let mut pos1 = serde_json::to_value(pos1_msg).unwrap();
                merge(
                    &mut pos1,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_pos1", &pos1);
            }
            messages::sensor::SensorData::GpsPos2(pos2_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_pos2",
                        "component_id": sensor.component_id
                    }),
                );

                let mut pos2 = serde_json::to_value(pos2_msg).unwrap();
                merge(
                    &mut pos2,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_pos2", &pos2);
            }
            messages::sensor::SensorData::Current(current_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_current",
                        "component_id": sensor.component_id
                    }),
                );

                let mut current = serde_json::to_value(current_msg).unwrap();
                merge(
                    &mut current,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_current", &current);
            }
            messages::sensor::SensorData::Voltage(voltage_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_voltage",
                        "component_id": sensor.component_id
                    }),
                );

                let mut voltage = serde_json::to_value(voltage_msg).unwrap();
                merge(
                    &mut voltage,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_voltage", &voltage);
            }
            messages::sensor::SensorData::Regulator(regulator_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_regulator",
                        "component_id": sensor.component_id
                    }),
                );

                let mut regulator = serde_json::to_value(regulator_msg).unwrap();
                merge(
                    &mut regulator,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_regulator", &regulator);
            }
            messages::sensor::SensorData::Temperature(temp_msg) => {
                let sensor_msg = self.create(
                    "rocket_sensor",
                    &serde_json::json!({
                        "parent": parent_id,
                        "discriminator": "rocket_temperature",
                        "component_id": sensor.component_id
                    }),
                );

                let mut temperature = serde_json::to_value(temp_msg).unwrap();
                merge(
                    &mut temperature,
                    &serde_json::json!({
                        "parent": sensor_msg.id
                    }),
                );

                self.create("rocket_temperature", &temperature);
            }
        }
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

                    // TODO: Normalize data
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
