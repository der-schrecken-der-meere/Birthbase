// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::Manager;

// mod models;
// mod handlers;
// mod routes;

// #[tauri::command]
// fn aatest() {
//     println!("Test");
// }

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

fn main() {
    // birthday_lib::run();
    tauri::Builder::default()
        // .plugin(tauri_plugin_notification::init())
        // .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while runnung tauri application")
}




