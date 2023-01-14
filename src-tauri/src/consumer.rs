use std::str;

use rdkafka::{
    consumer::{BaseConsumer, Consumer as KafkaConsumer},
    ClientConfig, Message,
};


use tauri::{AppHandle, Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

#[derive(serde::Deserialize, Clone)]
pub struct ConsumerConfig {
    pub address: String,
    pub topic: String,
    pub key: String,
}

impl ConsumerConfig {
    pub fn new(address: String, topic: String, key: String) -> Self {
        return Self{
            address, topic, key
        }
    }
}

pub struct Consumer {
    pub connection: Option<BaseConsumer>,
    pub address: String,
    pub topic: String,
}

impl Consumer {
    pub fn new(config: ConsumerConfig) -> Self {
        let connection: BaseConsumer = ClientConfig::new()
        .set("bootstrap.servers", config.address.to_owned())
        .set("auto.offset.reset", "smallest")
        .set("group.id", "my_consumer_group")
        .set("allow.auto.create.topics", "true")
        .create()
        .expect("invalid consumer config");

        let topic = config.topic.to_owned();
        
        Self {
            connection: Some(connection),
            address: config.address,
            topic: topic,
        }
    }

    pub fn subscribe(&mut self, topic: String, app_handler: AppHandle) {
        if !self.connection.is_none() {
            self.connection.as_mut()
                .expect("No connection")
                .subscribe(&[&topic])
                .expect("topic subscribe failed");
                loop {
                    println!("inside loop");
                    for msg_result in self.connection.as_mut().expect("No connection").iter() {
                        println!("inside msg_result");
                        let msg = msg_result.unwrap();
                        if let Some(value) = msg.payload() {
                            app_handler.emit_all(
                            "new-incoming-message",
                            Payload { 
                                message: std::str::from_utf8(value)
                                .expect("Error convertion")
                                .into() 
                            })
                                .unwrap();
                        }
                    }
                }
            }
    }
}