use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Tenant {
    pub id: String,

    pub tenant_name: String,
    pub tenant_code: String,
    pub tenant_gstin: String,

    pub tenant_address: String,
    pub location_address: String,

    pub rent_amount: f64,

    pub cgst_percent: f64,
    pub sgst_percent: f64,

    pub active: bool,

    pub created_at: String,
    pub updated_at: String,
}