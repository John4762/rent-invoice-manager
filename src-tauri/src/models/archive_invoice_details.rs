use serde::Serialize;

#[derive(Serialize)]
pub struct ArchiveInvoiceDetails {
    pub tenant_name: String,
    pub invoice_number: String,
    pub invoice_date: String,

    pub rent_amount: f64,

    pub cgst_amount: f64,
    pub sgst_amount: f64,

    pub total_amount: f64,

    pub generated_at: String,

    pub email_status: String,
    pub email_sent_at: Option<String>,
    pub email_error: Option<String>,

    pub pdf_path: String,
}