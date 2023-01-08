#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn subscribe() -> String {
    format!("subscribe")
}

#[tauri::command]
fn unsubscribe() -> String {
    format!("unsubscribe")
}

#[tauri::command]
fn send() -> String {
    format!("send")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(
            tauri::generate_handler![
                greet,
                subscribe,
                unsubscribe,
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
