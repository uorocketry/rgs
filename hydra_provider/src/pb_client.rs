use std::{collections::HashMap, string};

use crate::processing::ProcessedMessage;
use anyhow::Result;
use messages::{sensor::Sensor, Message};
use serde::{Deserialize, Serialize};
use serde_json::Value;

fn merge(a: &mut Value, b: Value) {
    if let Value::Object(a) = a {
        if let Value::Object(b) = b {
            for (k, v) in b {
                if v.is_null() {
                    a.remove(&k);
                } else {
                    merge(a.entry(k).or_insert(Value::Null), v);
                }
            }

            return;
        }
    }

    *a = b;
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
        let base_url = "http://localhost:3000/db";
        let url = format!("http://localhost:3000/db/api/admins/auth-with-password");
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
        T: Serialize + ?Sized,
    {
        let url = format!("{}/api/collections/{}/records", self.base_url, collection);
        let req = reqwest::blocking::Client::new()
            .post(&url)
            .json(&body)
            .bearer_auth(self.token.as_str())
            .send()
            .unwrap();

        let resp_json: Value = req.json().unwrap();
        let rocket_message: CreateResponse = serde_json::from_value(resp_json).unwrap();

        rocket_message
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

                self.create("rocket_time", time);

                // let utc_time = sensor_msg;
                // let utc_time_msg = match sensor.data {
                //     messages::sensor::SensorData::UtcTime(msg) => msg,
                //     _ => unreachable!(),
                // };
                // self.create(
                //     "rocket_sensor_utc_time",
                //     &serde_json::json!({
                //         "parent": utc_time.id,
                //         "time": utc_time_msg.time
                //     }),
                // );
            }
            // messages::sensor::SensorData::Air(_) => todo!(),
            // messages::sensor::SensorData::EkfQuat(_) => todo!(),
            // messages::sensor::SensorData::EkfNav1(_) => todo!(),
            // messages::sensor::SensorData::EkfNav2(_) => todo!(),
            // messages::sensor::SensorData::Imu1(_) => todo!(),
            messages::sensor::SensorData::Imu2(_) => todo!(),
            // messages::sensor::SensorData::GpsVel(_) => todo!(),
            // messages::sensor::SensorData::GpsPos1(_) => todo!(),
            // messages::sensor::SensorData::GpsPos2(_) => todo!(),
            // messages::sensor::SensorData::Current(_) => todo!(),
            // messages::sensor::SensorData::Voltage(_) => todo!(),
            // messages::sensor::SensorData::Regulator(_) => todo!(),
            // messages::sensor::SensorData::Temperature(_) => todo!(),
            _ => {}
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
                    println!("Command Message: {:?}", command_msg);
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
