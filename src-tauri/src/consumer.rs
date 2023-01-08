use kafka::consumer::{Consumer, FetchOffset, GroupOffsetStorage};
use kafka::error::Error as KafkaError;

pub struct Consumer {
    connection: Consumer
}

pub struct ConsumerConfig {
    address: str,
    topic: str,
    key: str,
}

impl Consumer {
    pub fn new(config: ConsumerConfig) -> Self {
        Self { config.address, config.topic, config.key }
    }

    pub fn subscribe(&mut self) {
        self.connection = Consumer::from_hosts(brokers)
        .with_topic(topic)
        .with_group(group)
        .with_fallback_offset(FetchOffset::Earliest)
        .with_offset_storage(GroupOffsetStorage::Kafka)
        .create()?;

        loop {
            let mss = self.connection.poll()?;
            if mss.is_empty() {
                println!("No messages available right now.");
                return Ok(());
            }

            for ms in mss.iter() {
                for m in ms.messages() {
                    println!(
                        "{}:{}@{}: {:?}",
                        ms.topic(),
                        ms.partition(),
                        m.offset,
                        m.value
                    );
                }
                let _ = self.connection.consume_messageset(ms);
            }
            self.connection.commit_consumed()?;
        }
    }
}