mod commands;
mod database;
mod models;
mod repositories;

use commands::tenant_commands::get_tenant_count;
use database::connection::get_connection;
use database::migrations::run_migrations;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = get_connection();

    run_migrations(&conn);

    println!("Database initialized successfully.");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(
            tauri::generate_handler![
                greet,
                get_tenant_count
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}