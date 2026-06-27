use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateTenantRequest {
    pub tenant_name: String,
    pub tenant_code: String,
    pub tenant_gstin: String,

    pub tenant_address: String,
    pub location_address: String,

    pub rent_amount: f64,

    pub cgst_percent: f64,
    pub sgst_percent: f64,

    pub active: bool,
}