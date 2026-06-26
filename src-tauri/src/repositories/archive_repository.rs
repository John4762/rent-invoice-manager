use rusqlite::Connection;

use crate::models::{
    archive_invoice::ArchiveInvoice,
    archive_month::ArchiveMonth,
};

pub struct ArchiveRepository;

impl ArchiveRepository {
    pub fn get_available_months(
        conn: &Connection,
    ) -> Vec<ArchiveMonth> {
        let mut stmt = conn
            .prepare(
                "
                SELECT DISTINCT
                    cycle_month,
                    cycle_year
                FROM invoice_runs
                ORDER BY cycle_year DESC,
                         cycle_month DESC
                ",
            )
            .unwrap();

        let months = stmt
            .query_map([], |row| {
                let month: i32 = row.get(0)?;
                let year: i32 = row.get(1)?;

                let month_name = match month {
                    1 => "January",
                    2 => "February",
                    3 => "March",
                    4 => "April",
                    5 => "May",
                    6 => "June",
                    7 => "July",
                    8 => "August",
                    9 => "September",
                    10 => "October",
                    11 => "November",
                    12 => "December",
                    _ => "Unknown",
                };

                Ok(ArchiveMonth {
                    month: format!(
                        "{} {}",
                        month_name,
                        year
                    ),
                })
            })
            .unwrap();

        months
            .map(|m| m.unwrap())
            .collect()
    }

pub fn get_invoices_for_month(
    conn: &Connection,
    month: i32,
    year: i32,
) -> Vec<ArchiveInvoice> {
    let mut stmt = conn
        .prepare(
            "
            SELECT
                ai.tenant_name_snapshot,
                ai.invoice_number,
                ai.grand_total,
                ai.email_status
            FROM archived_invoices ai
            INNER JOIN invoice_runs ir
                ON ir.id = ai.invoice_run_id
            WHERE ir.cycle_month = ?
              AND ir.cycle_year = ?
            ORDER BY ai.tenant_name_snapshot
            ",
        )
        .unwrap();

    let invoices = stmt
        .query_map(
            [month, year],
            |row| {
                Ok(ArchiveInvoice {
                    tenant_name: row.get(0)?,
                    invoice_number: row.get(1)?,
                    total_amount: row.get(2)?,
                    email_status: row.get(3)?,
                })
            },
        )
        .unwrap();

    invoices
        .map(|i| i.unwrap())
        .collect()
}

pub fn get_invoice_details(
    conn: &Connection,
    invoice_number: String,
) -> Option<crate::models::archive_invoice_details::ArchiveInvoiceDetails> {
    let mut stmt = conn
        .prepare(
            "
            SELECT
                ai.tenant_name_snapshot,
                ai.invoice_number,
                ai.invoice_date,

                ai.rent_amount,

                ai.cgst_amount,
                ai.sgst_amount,

                ai.grand_total,

                ai.generated_at,

                ai.email_status,
                ai.email_sent_at,
                ai.email_error,

                ai.pdf_path

            FROM archived_invoices ai
            WHERE ai.invoice_number = ?
            ",
        )
        .unwrap();

    stmt.query_row(
        [invoice_number],
        |row| {
            Ok(
                crate::models::archive_invoice_details::ArchiveInvoiceDetails {
                    tenant_name: row.get(0)?,
                    invoice_number: row.get(1)?,
                    invoice_date: row.get(2)?,

                    rent_amount: row.get(3)?,

                    cgst_amount: row.get(4)?,
                    sgst_amount: row.get(5)?,

                    total_amount: row.get(6)?,

                    generated_at: row.get(7)?,

                    email_status: row.get(8)?,
                    email_sent_at: row.get(9)?,
                    email_error: row.get(10)?,

                    pdf_path: row.get(11)?,
                },
            )
        },
    )
    .ok()
}

}