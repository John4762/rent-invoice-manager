use tauri::Manager;
use base64::{engine::general_purpose, Engine as _};
use std::fs;

#[tauri::command]
pub fn save_invoice_pdf(
    app: tauri::AppHandle,
    invoice_number: String,
    cycle_month: i32,
    cycle_year: i32,
    pdf_base64: String,
) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    let month_folder = format!(
        "{}-{:02}",
        cycle_year,
        cycle_month
    );

    let invoices_dir = app_data_dir
        .join("invoices")
        .join(&month_folder);

    fs::create_dir_all(&invoices_dir)
        .map_err(|e| e.to_string())?;

    let file_name = format!(
        "{}.pdf",
        invoice_number.replace("/", "-")
    );

    let file_path = invoices_dir.join(&file_name);

    let pdf_bytes = general_purpose::STANDARD
        .decode(pdf_base64)
        .map_err(|e| e.to_string())?;

    fs::write(&file_path, pdf_bytes)
        .map_err(|e| e.to_string())?;

    Ok(format!(
        "invoices/{}/{}",
        month_folder,
        file_name
    ))
}