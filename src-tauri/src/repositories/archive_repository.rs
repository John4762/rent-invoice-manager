use rusqlite::Connection;

pub struct ArchiveRepository;

impl ArchiveRepository {
    pub fn get_invoice_count(
        conn: &Connection,
    ) -> i32 {
        conn.query_row(
            "SELECT COUNT(*) FROM archived_invoices",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0)
    }
}