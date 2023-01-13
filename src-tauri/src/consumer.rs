use std::str;

use kafka::consumer::{Consumer as KafkaConsumer, FetchOffset, GroupOffsetStorage};

use tauri::{AppHandle, Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

#[derive(serde::Deserialize, Clone)]
pub struct ConsumerConfig {
    address: String,
    topic: String,
    key: String,
}

impl ConsumerConfig {
    pub fn new(address: String, topic: String, key: String) -> Self {
        return Self{
            address, topic, key
        }
    }
}

pub struct Consumer {
    pub connection: Option<KafkaConsumer>,
    pub address: String,
    pub topic: String,
    pub app_handler: Option<AppHandle>,
}

impl Consumer {
    pub fn new(config: ConsumerConfig, app_handler: AppHandle) -> Self {
        let address = vec![config.address.to_owned()];
        let topic = config.topic.to_owned();
        let connection = KafkaConsumer::from_hosts(address)
        .with_topic(config.topic)
        .with_fallback_offset(FetchOffset::Earliest)
        .with_offset_storage(GroupOffsetStorage::Kafka)
        .create();

        match connection {
            Ok(v) => Self {
                connection: Some(v),
                address: config.address,
                topic: topic,
                app_handler: None,
            },
            Err(_e) => Self {
                connection: None,
                address: config.address.to_owned(),
                topic: topic,
                app_handler: None,
            },
        }
    }

    pub fn subscribe(&mut self) {
        loop {
            println!("inside loop");
            if !self.connection.is_none() {
                println!("before match");
                for ms in self.connection.as_mut().expect("No connection").poll().unwrap().iter() {
                    for m in ms.messages() {
                        let message = match str::from_utf8(m.value) {
                            Ok(v) => v,
                            Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
                        };
                        self
                            .app_handler
                            .as_mut()
                            .expect("no handler")
                            .emit_all(
                                "new-incoming-message",
                                Payload { 
                                    message: message.to_owned()
                            });
                    }
                    self.connection.as_mut().expect("No connection").consume_messageset(ms);
                }
                // match mss {
                //     Ok(mss) => {
                //         if mss.is_empty() {
                //             println!("No messages available right now.");
                //         }
                //         println!("not empty");
                //         for ms in mss.iter() {
                //             println!("message sets iter");
                //             for m in ms.messages() {
                //                 let message = match str::from_utf8(m.value) {
                //                     Ok(v) => v,
                //                     Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
                //                 };
                //                 self
                //                     .app_handler
                //                     .as_mut()
                //                     .expect("no handler")
                //                     .emit_all(
                //                         "new-incoming-message",
                //                         Payload { 
                //                             message: message.to_owned()
                //                     });
                //                 // println!(
                //                 //     "{}:{}@{}: {:?}",
                //                 //     ms.topic(),
                //                 //     ms.partition(),
                //                 //     m.offset,
                //                 //     m.value
                //                 // );
                //             }
                //             let _ = self.connection.as_mut().expect("No connection").consume_messageset(ms);
                //         }
                //         println!("after consume");
                //         self.connection.as_mut().expect("No connection").commit_consumed();
                //     },
                //     Err(e) => {
                //         println!("error");
                //         println!("{:?}", e);
                //     },
                // }
            }
        }
    }
}