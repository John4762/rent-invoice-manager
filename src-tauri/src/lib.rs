mod commands;
mod database;
mod models;
mod repositories;

use commands::archive_commands::get_available_months;
use commands::archive_commands::get_invoice_details;
use commands::archive_commands::get_invoices_for_month;
use commands::archive_commands::open_pdf;
use commands::email_commands::send_invoice_email;
use commands::settings_commands::get_settings;
use commands::settings_commands::save_settings;
use commands::tenant_commands::create_tenant;
use commands::tenant_commands::delete_tenant;
use commands::tenant_commands::get_tenant_count;
use commands::tenant_commands::get_tenants;
use commands::tenant_commands::update_tenant;
use database::connection::get_connection;
use database::migrations::run_migrations;
use commands::archive_commands::archive_sent_invoices;
use commands::archive_commands::get_archived_invoice_conflicts;
use commands::file_commands::save_invoice_pdf;
use commands::resend_email_commands::resend_archived_invoice_email;

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
                get_tenant_count,
                get_tenants,
                create_tenant,
                update_tenant,
                delete_tenant,
                get_available_months,
                get_invoices_for_month,
                get_invoice_details,
                open_pdf,
                get_archived_invoice_conflicts,
                archive_sent_invoices,
                send_invoice_email,
                save_invoice_pdf,
                resend_archived_invoice_email,
                get_settings,
                save_settings
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
