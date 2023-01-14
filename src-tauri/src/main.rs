#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod producer;
mod consumer;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send(config: producer::ProducerConfig, message: String) {
    let mut new_producer = producer::Producer::new(&config);
    new_producer.send(&config.topic, config.key, message);
}

#[tauri::command]
fn unsubscribe() -> String {
    format!("unsubscribe")
}

#[tauri::command]
fn subscribe(config: consumer::ConsumerConfig, app_handle: tauri::AppHandle) {
    let topic = config.topic.to_owned();
    let mut new_consumer = consumer::Consumer::new(config);
    println!("subscribed on rust");
    std::thread::spawn(move || {
        new_consumer.subscribe(topic, app_handle);
      });
}

fn main() {
    tauri::Builder::default()
        .manage(producer::Producer::new(
            &producer::ProducerConfig::new("".to_owned(), "".to_owned(),"".to_owned())
        ))
        .invoke_handler(
            tauri::generate_handler![
                send,
                greet,
                subscribe,
                unsubscribe,
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
