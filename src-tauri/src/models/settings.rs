use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Settings {
    pub landlord_name: String,
    pub pan: String,
    pub gstin: String,
    pub address: String,

    pub invoice_prefix: String,

    pub recipient_email: String,
    pub sender_email: String,
    pub gmail_app_password: String,
}