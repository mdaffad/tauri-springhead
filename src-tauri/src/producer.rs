use rdkafka::config::ClientConfig;
use rdkafka::producer::{BaseProducer, BaseRecord, Producer};
use std::time::Duration;


pub struct ProducerConfig {
    address: String,
    topic: String,
    key: String,
}

impl ProducerConfig {
    pub fn new(address: String, topic: String, key: String) -> Self {
        return Self{
            address, topic, key
        }
    }
}

pub struct Producer {
    config: ProducerConfig,
    connection: BaseProducer,
}

impl Producer {
    pub fn new(config: ProducerConfig) -> Self {
        let connection = ClientConfig::new()
        .set("bootstrap.servers", "kafka:9092")
        .create()
        .expect("Producer creation error");
        Self {
            config,
            connection,
        }
    }

    pub fn send(&mut self, str: message) {
        self.connection = Producer::from_hosts(brokers)
        .with_topic(topic)
        .with_group(group)
        .with_fallback_offset(FetchOffset::Earliest)
        .with_offset_storage(GroupOffsetStorage::Kafka)
        .create()?;

        self.connection.send(
            BaseRecord::to("destination_topic")
                .payload("this is the payload")
                .key("and this is a key"),
        ).expect("Failed to enqueue");
    }
}