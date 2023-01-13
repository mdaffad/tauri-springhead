import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import MessageDisplayer from "./component/MessageDisplayer";

class KafkaConfig {
    constructor(address = "", topic = "", key = "") {
        this.address = address;
        this.topic = topic;
        this.key = key;
    }
    
    setAddress(address) {
        this.address = address? address : "";
        return this;
    }

    setTopic(topic) {
        this.topic = topic? topic: "";
        return this;
    }

    setKey(key){
        this.key = key? key: "";
        return this;
    }

    getJSON() {
        return {
            "address": this.address,
            "topic": this.topic,
            "key": this.key,
        }
    }
}

function App() {
    const [consumerConfig, setConsumerConfig] = useState(new KafkaConfig("localhost:9092", "message-topic", "v1"));
    const [producerConfig, setProducerConfig] = useState(new KafkaConfig("localhost:9092", "message-topic"));

    async function send() {
        invoke("send", {
            "config": producerConfig.getJSON(),
            "message": "Test Kafka via react tauri"
        })
        console.log(producerConfig.getJSON())
    }

    async function subscribe() {
        invoke("subscribe", {
            "config": consumerConfig.getJSON(),
        })
        console.log(consumerConfig.getJSON())
    }

    function setAddressProducer(address) {
        setProducerConfig(producerConfig.setAddress(address))
    }

    function setTopicProducer(topic) {
        setProducerConfig(producerConfig.setTopic(topic))
    }

    function setKeyProducer(key) {
        setProducerConfig(producerConfig.setKey(key))
    }

    function setAddressConsumer(address) {
        setConsumerConfig(consumerConfig.setAddress(address))
    }

    function setTopicConsumer(topic) {
        setConsumerConfig(consumerConfig.setTopic(topic))
    }

    function setKeyConsumer(key) {
        setConsumerConfig(consumerConfig.setKey(key))
    }

    return (
        <div>
            <div className="container">
                <h1>Welcome to Springhead Tauri!</h1>
                <h4>Client for Kafka over Tauri</h4>
            </div>

            <div className="row">
                <div className="container">
                    <div className="row">
                        <h3>Producer</h3>
                    </div>
                    <div className="row">
                        <div className="custom-text">
                            Address
                        </div>
                        <div>
                            <input
                                onChange={(e) => setAddressProducer(e.currentTarget.value)}
                                placeholder="e.x. localhost:9092"
                                defaultValue="localhost:9092"
                        />
                        </div>
                    </div>
                    <div className="row">
                        <div className="custom-text">
                            Topic
                        </div>
                        <div>
                            <input
                                onChange={(e) => setTopicProducer(e.currentTarget.value)}
                                placeholder="e.x. tweet"
                                defaultValue="message-topic"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="custom-text">
                            Key
                        </div>
                        <div>
                            <input
                                onChange={(e) => setKeyProducer(e.currentTarget.value)}
                                placeholder="e.x. v1"
                                defaultValue="v1"
                            />
                        </div>
                    </div>
                        <div className="container">
                            <div className="row" >
                                <button type="button" onClick={() => send()}>
                                    Send
                                </button>
                            </div>
                        </div>
                </div>

                <div className="container">
                    <div className="row">
                        <h3>Consumer</h3>
                    </div>

                    <div className="row">
                        <div className="custom-text">
                            Address
                        </div>
                        <div>
                            <input
                                onChange={(e) => setAddressConsumer(e.currentTarget.value)}
                                placeholder="e.x. localhost:9092"
                                defaultValue="localhost:9092"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="custom-text">
                            Topic
                        </div>
                        <div>
                            <input
                                onChange={(e) => setTopicConsumer(e.currentTarget.value)}
                                placeholder="e.x. tweet"
                                defaultValue="message-topic"

                            />
                        </div>
                    </div>

                    <div className="row" style={{visibility: 'hidden' }}>
                        <div className="custom-text">
                            Key
                        </div>
                        <div>
                            <input
                                onChange={(e) => setKeyConsumer(e.currentTarget.value)}
                                placeholder="e.x. v1"
                            />
                        </div>
                    </div>

                    <div className="container">
                        <div className="row" >
                            <button type="button" onClick={() => subscribe()}>
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <label className="display-kafka-consumer">
                    <MessageDisplayer message=""/>
                </label>
            </div>

        </div>
    );
}

export default App;
