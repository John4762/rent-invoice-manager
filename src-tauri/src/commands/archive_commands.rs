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