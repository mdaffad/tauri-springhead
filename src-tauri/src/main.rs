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
    // *new_producer = producer::ProducerState::self(producer::Producer::new(&config));
    let mut new_producer = producer::Producer::new(&config);
    new_producer.send(&config.topic, config.key, message);
}

// #[tauri::command]
// fn update_producer(config: producer::ProducerConfig, state: tauri::State<producer::Producer>) {
//     // *new_producer = producer::ProducerState::self(producer::Producer::new(&config));
//     let mut new_producer = state.inner();
//     let binding = producer::Producer::new(&config);
//     println!("{:?}", new_producer.address)
// }

#[tauri::command]
fn unsubscribe() -> String {
    format!("unsubscribe")
}

#[tauri::command]
fn subscribe(config: consumer::ConsumerConfig, app_handle: tauri::AppHandle) {
    let mut new_consumer = consumer::Consumer::new(config, app_handle.clone());
    println!("subscribed on rust");
    std::thread::spawn(move || {
        new_consumer.subscribe();
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
