use tauri::{generate_context, Builder};
use tauri_plugin_notification;

fn main() {
    // birthday_lib::run()
    Builder::default()
        .plugin(tauri_plugin_notification::init())
        .run(generate_context!())
        .expect("error while runnung tauri application")
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


