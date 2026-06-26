use serde::Serialize;

#[derive(Serialize)]
pub struct ArchiveInvoice {
    pub tenant_name: String,
    pub invoice_number: String,
    pub total_amount: f64,
    pub email_sent: bool,
}