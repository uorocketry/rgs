use std::{collections::HashMap, string};

use crate::processing::ProcessedMessage;
use anyhow::Result;
use serde::{Deserialize, Serialize};
use serde_json::Value;

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

    pub fn send(&self, msg: &ProcessedMessage) -> Result<()> {
        // Create new rocket_message temp
        let log_msg: messages::Log = messages::Log::new(
            messages::LogLevel::Error,
            messages::Event::Error(messages::ErrorContext::GroundStation),
        );
        let rocket_message = messages::Message {
            timestamp: 0,
            sender: messages::sender::Sender::GroundStation,
            data: messages::Data::Log(log_msg.clone()),
        };

        let parent_msg = self.create(
            "rocket_message",
            &serde_json::json!({
                "timestamp": rocket_message.timestamp,
                "sender": rocket_message.sender,
                "discriminator": "rocket_log"
            }),
        );

        let log_msg_json = serde_json::to_value(log_msg).unwrap();

        self.create(
            "rocket_log",
            &serde_json::json!({
                "parent": parent_msg.id,
                "level": log_msg_json.get("level").unwrap(),
                "event": log_msg_json.get("event").unwrap()
            }),
        );
        return Ok(());

        match msg {
            ProcessedMessage::RocketMessage(rocket_message) => match &rocket_message.data {
                messages::Data::State(state) => {
                    let parent_msg = self.create(
                        "rocket_message",
                        &serde_json::json!({
                            "timestamp": rocket_message.timestamp,
                            "sender": rocket_message.sender,
                            "discriminator": "rocket_state"
                        }),
                    );
                    self.create(
                        "rocket_state",
                        &serde_json::json!({
                            "parent": parent_msg.id,
                            "state": state.data
                        }),
                    );
                }
                messages::Data::Sensor(sensor) => {
                    let parent_msg = self.create(
                        "rocket_message",
                        &serde_json::json!({
                            "timestamp": rocket_message.timestamp,
                            "sender": rocket_message.sender,
                            "discriminator": "rocket_sensor"
                        }),
                    );
                    self.create(
                        "rocket_sensor",
                        &serde_json::json!({
                            "parent": parent_msg.id,
                            "data": sensor.data,
                            "component_id": sensor.component_id
                        }),
                    );
                }
                messages::Data::Log(log_msg) => {
                    println!("Log Message");
                    let parent_msg = self.create(
                        "rocket_message",
                        &serde_json::json!({
                            "timestamp": rocket_message.timestamp,
                            "sender": rocket_message.sender,
                            "discriminator": "rocket_log"
                        }),
                    );
                    let log_msg_json = serde_json::to_value(log_msg).unwrap();

                    self.create(
                        "rocket_log",
                        &serde_json::json!({
                            "parent": parent_msg.id,
                            "level": log_msg_json.get("level").unwrap(),
                            "event": log_msg_json.get("event").unwrap()
                        }),
                    );
                }
                messages::Data::Command(_) => {
                    self.create(
                        "rocket_message",
                        &serde_json::json!({
                            "timestamp": rocket_message.timestamp,
                            "sender": rocket_message.sender,
                            "discriminator": "rocket_command"
                        }),
                    );
                }
            },
            ProcessedMessage::LinkStatus(linkStatus) => {
                // self.create("rocket_link", linkStatus);
                // println!("{:#?}", &serde_json::to_string(msg)?);
            }
        }
        Ok(())
    }
}
