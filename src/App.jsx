import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

class KafkaConfig {
  constructor(address = "", topic = "", key = "")  {
    this.address = address;
    this.topic = topic;
    this.key = key;
  }
    
  setAddress(address) {
    this.address = address;
  }

  setTopic(topic) {
    this.topic = topic;
  }

  setKey(key){
    this.key = key;
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
  const [greetMsg, setGreetMsg] = useState("");
  const [consumerConfig, setConsumerConfig] = useState(new KafkaConfig());
  const [publisherConfig, setPublisherConfig] = useState(new KafkaConfig());

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function publish() {
    console.log(publisherConfig.getJSON())
  }

  async function subscribe() {
    console.log(consumerConfig.getJSON())
  }

  function setAddressPublisher(currentConfig, address) {
    setConsumerConfig(currentConfig.setAddress(address))
  }

  function setTopicPublisher(currentConfig, topic) {
    setConsumerConfig(currentConfig.setTopic(topic))
  }

  function setKeyPublisher(currentConfig, key) {
    setConsumerConfig(currentConfig.setKey(key))
  }

  return (
    <div>
      <div className="container">
          <h1>Welcome to Springhead Tauri!</h1>
          <h4>Client Visualizer for Springhead</h4>
      </div>

      <div className="row">
        <div className="container">
          <div className="row">
            <h3>Publisher</h3>
          </div>
          <div className="row">
            <div className="custom-text">
              Address
            </div>
            <div>
              <input
                onChange={(e) => setAddressPublisher(e.currentTarget.value)}
                placeholder="e.x. http://localhost:9092"
              />
            </div>
          </div>
          <div className="row">
            <div className="custom-text">
              Topic
            </div>
            <div>
              <input
                onChange={(e) => setTopicPublisher(e.currentTarget.value)}
                placeholder="e.x. tweet"
              />
            </div>
          </div>
          <div className="row">
            <div className="custom-text">
              Key
            </div>
            <div>
              <input
                onChange={(e) => setKeyPublisher(e.currentTarget.value)}
                placeholder="e.x. v1"
              />
            </div>
          </div>
          <div className="container">
            <div className="row" >
              <button type="button" onClick={() => publish()}>
                  Publish
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
                onChange={(e) => setAddressPublisher(e.currentTarget.value)}
                placeholder="e.x. http://localhost:9092"
              />
            </div>
          </div>

          <div className="row">
            <div className="custom-text">
              Topic
            </div>
            <div>
              <input
                onChange={(e) => setTopicPublisher(e.currentTarget.value)}
                placeholder="e.x. tweet"
              />
            </div>
          </div>

          <div className="row" style={{visibility: 'hidden' }}>
            <div className="custom-text">
              Key
            </div>
            <div>
              <input
                onChange={(e) => setKeyPublisher(e.currentTarget.value)}
                placeholder="e.x. v1"
              />
            </div>
          </div>

          <div className="container">
            <div className="row" >
              <button type="button" onClick={() => subscribe()}>
                  Consumer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <label className="display-kafka-consumer">
          asdasd
        </label>
      </div>

    </div>
  );
}

export default App;
