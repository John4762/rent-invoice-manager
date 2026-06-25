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
        ",
    )
    .unwrap();
}