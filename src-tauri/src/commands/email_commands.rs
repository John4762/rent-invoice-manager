use base64::{engine::general_purpose, Engine as _};
use lettre::message::{header::ContentType, Attachment, Mailbox, Message, MultiPart, SinglePart};
use lettre::transport::smtp::authentication::Credentials;
use lettre::{SmtpTransport, Transport};
use serde::Deserialize;
use std::env;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailAttachmentPayload {
    pub file_name: String,
    pub content_base64: String,
    pub content_type: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendInvoiceEmailPayload {
    pub sender_email: String,
    pub recipient_email: String,
    pub subject: String,
    pub body: String,
    pub attachments: Vec<EmailAttachmentPayload>,
}

#[tauri::command]
pub async fn send_invoice_email(payload: SendInvoiceEmailPayload) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || send_invoice_email_sync(payload))
        .await
        .map_err(|error| format!("Email task failed: {error}"))?
}

fn send_invoice_email_sync(payload: SendInvoiceEmailPayload) -> Result<(), String> {
    if payload.sender_email.trim().is_empty() {
        return Err("Sender email is missing.".to_string());
    }

    if payload.recipient_email.trim().is_empty() {
        return Err("Recipient email is missing.".to_string());
    }

    if payload.attachments.is_empty() {
        return Err("No invoice attachments were provided.".to_string());
    }

    let smtp_password = env::var("SMTP_PASSWORD")
        .map_err(|_| "SMTP_PASSWORD environment variable is missing.".to_string())?;

    let from_mailbox: Mailbox = payload
        .sender_email
        .parse()
        .map_err(|_| "Sender email is not valid.".to_string())?;

    let recipient_mailbox: Mailbox = payload
        .recipient_email
        .parse()
        .map_err(|_| "Recipient email is not valid.".to_string())?;

    let mut multipart = MultiPart::mixed().singlepart(SinglePart::plain(payload.body));

    for attachment in payload.attachments {
        let bytes = general_purpose::STANDARD
            .decode(attachment.content_base64)
            .map_err(|_| format!("Could not decode attachment {}", attachment.file_name))?;

        let content_type = ContentType::parse(&attachment.content_type)
            .map_err(|_| format!("Invalid content type for {}", attachment.file_name))?;

        multipart = multipart.singlepart(
            Attachment::new(attachment.file_name).body(bytes, content_type),
        );
    }

    let email = Message::builder()
        .from(from_mailbox)
        .to(recipient_mailbox)
        .subject(payload.subject)
        .multipart(multipart)
        .map_err(|error| format!("Could not build email: {error}"))?;

    let credentials = Credentials::new(payload.sender_email, smtp_password);

    let mailer = SmtpTransport::relay("smtp.gmail.com")
    .map_err(|error| format!("Could not connect to Gmail SMTP: {error}"))?
    .credentials(credentials)
    .build();

    mailer
        .send(&email)
        .map_err(|error| format!("Could not send email: {error}"))?;

    Ok(())
}