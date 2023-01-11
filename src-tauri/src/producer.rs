use std::sync::Mutex;

use kafka::producer::{Producer as KafkaProducer, Record};

#[derive(serde::Deserialize)]
pub struct ProducerConfig {
    pub address: String,
    pub topic: String,
    pub key: String,
}

impl ProducerConfig {
    pub fn new(address: String, topic: String, key: String) -> Self {
        return Self{
            address, topic, key
        }
    }
}

pub struct Producer {
    pub connection: Option<KafkaProducer>,
    pub address: String,
}

impl Producer {
    pub fn new(config: &ProducerConfig) -> Self {
        let address = vec![config.address.to_owned()];

        let connection =
            KafkaProducer::from_hosts(address)
                .create();

        match connection {
            Ok(v) => Self {
                connection: Some(v),
                address: config.address.to_owned(),
            },
            Err(e) => Self {
                connection: None,
                address: config.address.to_owned(),
            },
        }
    }

    pub fn send(&mut self, topic: &str, key: String, message: String) {
        let record = Record {
            key: key,
            value: message.as_bytes(),
            topic: topic,
            partition: -1,
        };
        if !self.connection.is_none() {
            self.connection.as_mut().expect("No connection").send(&record).unwrap();
            println!("message sent");
        }
    }
}

// pub struct ProducerState(Producer);

// let producer_config = ProducerConfig::new(
//     "localhost:9092".to_owned(),"message-topic".to_owned(),"test".to_owned()
// );
// let mut producer = Producer::new(&producer_config);
// let message = "test new kafka producer";
// producer.send(&producer_config.topic, producer_config.key, message.to_owned());
// println!("test");