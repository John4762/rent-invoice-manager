use crate::models::tenant::Tenant;
use rusqlite::{params, Connection};

use crate::models::create_tenant_request::CreateTenantRequest;

pub struct TenantRepository;

impl TenantRepository {
    pub fn count(conn: &Connection) -> i32 {
        conn.query_row(
            "SELECT COUNT(*) FROM tenants",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0)
    }

    pub fn create(
    conn: &Connection,
    tenant: CreateTenantRequest,
) {
    let timestamp =
        chrono::Local::now()
            .format("%Y-%m-%d %H:%M:%S")
            .to_string();

    let id = format!(
        "tenant_{}",
        tenant.tenant_code.to_lowercase()
    );

    conn.execute(
        "
        INSERT INTO tenants (
            id,
            tenant_name,
            tenant_code,
            tenant_gstin,
            tenant_address,
            location_address,
            rent_amount,
            cgst_percent,
            sgst_percent,
            active,
            created_at,
            updated_at
        )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ",
        params![
            id,
            tenant.tenant_name,
            tenant.tenant_code,
            tenant.tenant_gstin,
            tenant.tenant_address,
            tenant.location_address,
            tenant.rent_amount,
            tenant.cgst_percent,
            tenant.sgst_percent,
            tenant.active,
            timestamp,
            timestamp
        ],
    )
    .unwrap();
}

    pub fn get_all(
        conn: &Connection,
    ) -> Vec<Tenant> {
        let mut stmt = conn
            .prepare(
                "
                SELECT
                    id,
                    tenant_name,
                    tenant_code,
                    tenant_gstin,
                    tenant_address,
                    location_address,
                    rent_amount,
                    cgst_percent,
                    sgst_percent,
                    active,
                    created_at,
                    updated_at
                FROM tenants
                ORDER BY tenant_name
                ",
            )
            .unwrap();

        let rows = stmt
            .query_map([], |row| {
                Ok(Tenant {
                    id: row.get(0)?,
                    tenant_name: row.get(1)?,
                    tenant_code: row.get(2)?,
                    tenant_gstin: row.get(3)?,
                    tenant_address: row.get(4)?,
                    location_address: row.get(5)?,
                    rent_amount: row.get(6)?,
                    cgst_percent: row.get(7)?,
                    sgst_percent: row.get(8)?,
                    active: row.get::<_, i32>(9)? == 1,
                    created_at: row.get(10)?,
                    updated_at: row.get(11)?,
                })
            })
            .unwrap();

        rows
            .map(|row| row.unwrap())
            .collect()
    }
}