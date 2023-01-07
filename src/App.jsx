import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [consumerConfig, setConsumerConfig] = useState({});
  const [publisherConfig, setPublisherConfig] = useState({});
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
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
            <div>
              <input
                id="greet-input"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Enter a name..."
              />
              <button type="button" onClick={() => greet()}>
                Greet
              </button>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div>
              <input
                id="greet-input"
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="Enter a name..."
              />
              <button type="button" onClick={() => greet()}>
                Greet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
