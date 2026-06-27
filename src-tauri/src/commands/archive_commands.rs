use rusqlite::params;
use serde::{Deserialize, Serialize};
use crate::database::connection::get_connection;
use crate::models::archive_invoice::ArchiveInvoice;
use crate::models::archive_invoice_details::ArchiveInvoiceDetails;
use crate::models::archive_month::ArchiveMonth;
use crate::repositories::archive_repository::ArchiveRepository;
use tauri::AppHandle;
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub fn get_available_months() -> Vec<ArchiveMonth> {
    let conn = get_connection();

    ArchiveRepository::get_available_months(&conn)
}

#[tauri::command]
pub fn get_invoices_for_month(
    month: i32,
    year: i32,
) -> Vec<ArchiveInvoice> {
    let conn = get_connection();

    ArchiveRepository::get_invoices_for_month(
        &conn,
        month,
        year,
    )
}

#[tauri::command]
pub fn get_invoice_details(
    invoice_number: String,
) -> Option<ArchiveInvoiceDetails> {
    let conn = get_connection();

    ArchiveRepository::get_invoice_details(
        &conn,
        invoice_number,
    )
}

#[tauri::command]
pub fn open_pdf(
    app: AppHandle,
    pdf_path: String,
) -> Result<(), String> {
    app.opener()
        .open_path(pdf_path, None::<&str>)
        .map_err(|e| e.to_string())
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ArchivedInvoiceConflict {
    pub tenant_id: String,
    pub invoice_number: String,
    pub tenant_name: String,
    pub email_status: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArchiveSentInvoicePayload {
    pub cycle_month: i32,
    pub cycle_year: i32,
    pub generated_at: String,
    pub invoices: Vec<ArchiveSentInvoiceInput>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArchiveSentInvoiceInput {
    pub tenant_id: String,
    pub invoice_number: String,
    pub tenant_name: String,
    pub tenant_address: String,
    pub location_address: String,
    pub invoice_date: String,
    pub financial_year: String,
    pub rent_amount: f64,
    pub cgst_percent: f64,
    pub cgst_amount: f64,
    pub sgst_percent: f64,
    pub sgst_amount: f64,
    pub grand_total: f64,
    pub pdf_path: String,
}

#[tauri::command]
pub fn get_archived_invoice_conflicts(
    tenant_ids: Vec<String>,
    cycle_month: i32,
    cycle_year: i32,
) -> Vec<ArchivedInvoiceConflict> {
    let conn = get_connection();

    let mut conflicts = Vec::new();

    let mut stmt = conn
        .prepare(
            "
            SELECT
                ai.tenant_id,
                ai.invoice_number,
                ai.tenant_name_snapshot,
                ai.email_status
            FROM archived_invoices ai
            INNER JOIN invoice_runs ir
                ON ir.id = ai.invoice_run_id
            WHERE ai.tenant_id = ?
              AND ir.cycle_month = ?
              AND ir.cycle_year = ?
            LIMIT 1
            ",
        )
        .unwrap();

    for tenant_id in tenant_ids {
        let result = stmt.query_row(
            params![tenant_id, cycle_month, cycle_year],
            |row| {
                Ok(ArchivedInvoiceConflict {
                    tenant_id: row.get(0)?,
                    invoice_number: row.get(1)?,
                    tenant_name: row.get(2)?,
                    email_status: row.get(3)?,
                })
            },
        );

        if let Ok(conflict) = result {
            conflicts.push(conflict);
        }
    }

    conflicts
}

#[tauri::command]
pub fn archive_sent_invoices(
    payload: ArchiveSentInvoicePayload,
) -> Result<(), String> {
    let conn = get_connection();

    let run_id = format!(
        "run_{}_{}",
        payload.cycle_year,
        payload.cycle_month
    );

    conn.execute(
        "
        INSERT OR IGNORE INTO invoice_runs (
            id,
            cycle_month,
            cycle_year,
            generated_at
        )
        VALUES (?, ?, ?, ?)
        ",
        params![
            run_id,
            payload.cycle_month,
            payload.cycle_year,
            payload.generated_at
        ],
    )
    .map_err(|error| error.to_string())?;

    for invoice in payload.invoices {
        let archived_invoice_id = format!(
            "archived_{}_{}_{}",
            payload.cycle_year,
            payload.cycle_month,
            invoice.tenant_id
        );

        conn.execute(
            "
            INSERT OR REPLACE INTO archived_invoices (
                id,
                invoice_run_id,
                tenant_id,
                invoice_number,
                tenant_name_snapshot,
                tenant_address_snapshot,
                location_address_snapshot,
                invoice_date,
                financial_year,
                rent_amount,
                cgst_percent,
                cgst_amount,
                sgst_percent,
                sgst_amount,
                grand_total,
                pdf_path,
                email_status,
                email_sent_at,
                email_error,
                generated_at
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent', ?, NULL, ?
            )
            ",
            params![
                archived_invoice_id,
                run_id,
                invoice.tenant_id,
                invoice.invoice_number,
                invoice.tenant_name,
                invoice.tenant_address,
                invoice.location_address,
                invoice.invoice_date,
                invoice.financial_year,
                invoice.rent_amount,
                invoice.cgst_percent,
                invoice.cgst_amount,
                invoice.sgst_percent,
                invoice.sgst_amount,
                invoice.grand_total,
                invoice.pdf_path,
                payload.generated_at,
                payload.generated_at
            ],
        )
        .map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn seed_archive_data() {
    let conn = get_connection();

    // Invoice Runs

    conn.execute(
        "
        INSERT OR IGNORE INTO invoice_runs (
            id,
            cycle_month,
            cycle_year,
            generated_at
        )
        VALUES (
            'run_june_2026',
            6,
            2026,
            '2026-06-02'
        )
        ",
        [],
    )
    .unwrap();

    conn.execute(
        "
        INSERT OR IGNORE INTO invoice_runs (
            id,
            cycle_month,
            cycle_year,
            generated_at
        )
        VALUES (
            'run_may_2026',
            5,
            2026,
            '2026-05-02'
        )
        ",
        [],
    )
    .unwrap();

    conn.execute(
        "
        INSERT OR IGNORE INTO invoice_runs (
            id,
            cycle_month,
            cycle_year,
            generated_at
        )
        VALUES (
            'run_april_2026',
            4,
            2026,
            '2026-04-02'
        )
        ",
        [],
    )
    .unwrap();

    // Archived Invoices

    conn.execute(
        "
        INSERT OR IGNORE INTO archived_invoices (
            id,
            invoice_run_id,
            tenant_id,
            invoice_number,
            tenant_name_snapshot,
            tenant_address_snapshot,
            location_address_snapshot,
            invoice_date,
            financial_year,
            rent_amount,
            cgst_percent,
            cgst_amount,
            sgst_percent,
            sgst_amount,
            grand_total,
            pdf_path,
            email_status,
            email_sent_at,
            email_error,
            generated_at
        )
        VALUES (
            'inv_june_cp',
            'run_june_2026',
            'tenant_cp',
            'AJ/CP/3/26-27',
            'CP Traders',
            'Kochi Address',
            'Office Address',
            '2026-06-01',
            '26-27',
            25000,
            9,
            2250,
            9,
            2250,
            29500,
            'archive/june/cp.pdf',
            'sent',
            '2026-06-02',
            NULL,
            '2026-06-02'
        )
        ",
        [],
    )
    .unwrap();

    conn.execute(
        "
        INSERT OR IGNORE INTO archived_invoices (
            id,
            invoice_run_id,
            tenant_id,
            invoice_number,
            tenant_name_snapshot,
            tenant_address_snapshot,
            location_address_snapshot,
            invoice_date,
            financial_year,
            rent_amount,
            cgst_percent,
            cgst_amount,
            sgst_percent,
            sgst_amount,
            grand_total,
            pdf_path,
            email_status,
            email_sent_at,
            email_error,
            generated_at
        )
        VALUES (
            'inv_june_xyz',
            'run_june_2026',
            'tenant_xyz',
            'AJ/XYZ/3/26-27',
            'XYZ Logistics',
            'Kochi Address',
            'Office Address',
            '2026-06-01',
            '26-27',
            40000,
            9,
            3600,
            9,
            3600,
            47200,
            'archive/june/xyz.pdf',
            'failed',
            NULL,
            'SMTP Authentication Failed',
            '2026-06-02'
        )
        ",
        [],
    )
    .unwrap();

    conn.execute(
        "
        INSERT OR IGNORE INTO archived_invoices (
            id,
            invoice_run_id,
            tenant_id,
            invoice_number,
            tenant_name_snapshot,
            tenant_address_snapshot,
            location_address_snapshot,
            invoice_date,
            financial_year,
            rent_amount,
            cgst_percent,
            cgst_amount,
            sgst_percent,
            sgst_amount,
            grand_total,
            pdf_path,
            email_status,
            email_sent_at,
            email_error,
            generated_at
        )
        VALUES (
            'inv_may_cp',
            'run_may_2026',
            'tenant_cp',
            'AJ/CP/2/26-27',
            'CP Traders',
            'Kochi Address',
            'Office Address',
            '2026-05-01',
            '26-27',
            25000,
            9,
            2250,
            9,
            2250,
            29500,
            'archive/may/cp.pdf',
            'sent',
            '2026-05-02',
            NULL,
            '2026-05-02'
        )
        ",
        [],
    )
    .unwrap();

    conn.execute(
        "
        INSERT OR IGNORE INTO archived_invoices (
            id,
            invoice_run_id,
            tenant_id,
            invoice_number,
            tenant_name_snapshot,
            tenant_address_snapshot,
            location_address_snapshot,
            invoice_date,
            financial_year,
            rent_amount,
            cgst_percent,
            cgst_amount,
            sgst_percent,
            sgst_amount,
            grand_total,
            pdf_path,
            email_status,
            email_sent_at,
            email_error,
            generated_at
        )
        VALUES (
            'inv_april_cp',
            'run_april_2026',
            'tenant_cp',
            'AJ/CP/1/26-27',
            'CP Traders',
            'Kochi Address',
            'Office Address',
            '2026-04-01',
            '26-27',
            25000,
            9,
            2250,
            9,
            2250,
            29500,
            'archive/april/cp.pdf',
            'sent',
            '2026-04-02',
            NULL,
            '2026-04-02'
        )
        ",
        [],
    )
    .unwrap();
}