use std::fs;

use base64::{engine::general_purpose, Engine as _};

use crate::commands::email_commands::{
    send_invoice_email_sync,
    EmailAttachmentPayload,
    SendInvoiceEmailPayload,
};
use crate::database::connection::get_connection;
use crate::repositories::archive_repository::ArchiveRepository;
use crate::repositories::settings_repository::SettingsRepository;

#[tauri::command]
pub fn resend_archived_invoice_email(
    invoice_number: String,
) -> Result<(), String> {
    let conn = get_connection();

    let invoice = ArchiveRepository::get_invoice_details(
        &conn,
        invoice_number.clone(),
    )
    .ok_or("Invoice not found")?;

    let settings = SettingsRepository::get_settings(&conn)
        .ok_or("Settings not found")?;

    let full_pdf_path = tauri::utils::platform::current_exe()
        .map_err(|e| e.to_string())?;

    drop(full_pdf_path);

    let app_data_path =
        dirs::data_dir().ok_or("Could not resolve app data directory")?;

    let pdf_path = app_data_path.join(
        "com.john.rent-invoice-manager",
    );

    let pdf_file = pdf_path.join(&invoice.pdf_path);

    if !pdf_file.exists() {
        return Err(format!(
            "Archived PDF not found: {}",
            pdf_file.display()
        ));
    }

    let pdf_bytes =
        fs::read(&pdf_file).map_err(|e| e.to_string())?;

    let payload = SendInvoiceEmailPayload {
        sender_email: settings.sender_email,
        recipient_email: settings.recipient_email,
        gmail_app_password: settings.gmail_app_password,

        subject: format!(
            "Invoice {}",
            invoice.invoice_number
        ),

        body: format!(
            "Please find attached invoice {}.",
            invoice.invoice_number
        ),

        attachments: vec![EmailAttachmentPayload {
            file_name: format!(
                "{}.pdf",
                invoice.invoice_number.replace("/", "-")
            ),
            content_base64: general_purpose::STANDARD
                .encode(pdf_bytes),
            content_type: "application/pdf".to_string(),
        }],
    };

    match send_invoice_email_sync(payload) {
        Ok(_) => {
            ArchiveRepository::mark_email_sent(
                &conn,
                invoice_number,
            );

            Ok(())
        }

        Err(error) => {
            ArchiveRepository::mark_email_failed(
                &conn,
                invoice_number,
                error.clone(),
            );

            Err(error)
        }
    }
}