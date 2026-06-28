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
            deleted INTEGER NOT NULL DEFAULT 0,

            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

CREATE TABLE IF NOT EXISTS invoice_runs (
    id TEXT PRIMARY KEY,

    cycle_month INTEGER NOT NULL,
    cycle_year INTEGER NOT NULL,

    generated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK(id = 1),

    landlord_name TEXT NOT NULL,
    pan TEXT NOT NULL,
    gstin TEXT NOT NULL,
    address TEXT NOT NULL,

    invoice_prefix TEXT NOT NULL,
    sac_code TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    gmail_app_password TEXT NOT NULL
);

INSERT OR IGNORE INTO settings (
    id,
    landlord_name,
    pan,
    gstin,
    address,
    invoice_prefix,
    sac_code,
    recipient_email,
    sender_email,
    gmail_app_password
)
VALUES (
    1,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
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

    email_status TEXT NOT NULL DEFAULT 'pending',
    email_sent_at TEXT,
    email_error TEXT,

    generated_at TEXT NOT NULL,

    FOREIGN KEY(invoice_run_id)
        REFERENCES invoice_runs(id)
);
        ",
    )
    .unwrap();

    conn.execute(
    "
    ALTER TABLE tenants
    ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0
    ",
    [],
)
.ok();

conn.execute(
    "
    ALTER TABLE settings
    ADD COLUMN sac_code TEXT NOT NULL DEFAULT ''
    ",
    [],
)
.ok();

}