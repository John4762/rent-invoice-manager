use rusqlite::Connection;

pub fn run_migrations(conn: &Connection) {
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS tenants (
            id TEXT PRIMARY KEY,
            tenant_name TEXT NOT NULL,
            tenant_code TEXT NOT NULL,
            tenant_gstin TEXT NOT NULL,

            tenant_address TEXT NOT NULL,
            location_address TEXT NOT NULL,

            rent_amount REAL NOT NULL,

            cgst_percent REAL NOT NULL,
            sgst_percent REAL NOT NULL,

            active INTEGER NOT NULL,

            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS invoice_runs (
            id TEXT PRIMARY KEY,

            cycle_month INTEGER NOT NULL,
            cycle_year INTEGER NOT NULL,

            generated_at TEXT NOT NULL,

            email_sent INTEGER NOT NULL DEFAULT 0,
            email_sent_at TEXT
        );

        CREATE TABLE IF NOT EXISTS archived_invoices (
            id TEXT PRIMARY KEY,

            invoice_run_id TEXT NOT NULL,

            tenant_id TEXT NOT NULL,

            invoice_number TEXT NOT NULL,

            tenant_name_snapshot TEXT NOT NULL,
            tenant_address_snapshot TEXT NOT NULL,
            location_address_snapshot TEXT NOT NULL,

            invoice_date TEXT NOT NULL,
            financial_year TEXT NOT NULL,

            rent_amount REAL NOT NULL,

            cgst_percent REAL NOT NULL,
            cgst_amount REAL NOT NULL,

            sgst_percent REAL NOT NULL,
            sgst_amount REAL NOT NULL,

            grand_total REAL NOT NULL,

            pdf_path TEXT NOT NULL,

            generated_at TEXT NOT NULL,

            FOREIGN KEY(invoice_run_id)
                REFERENCES invoice_runs(id)
        );
        ",
    )
    .unwrap();
}