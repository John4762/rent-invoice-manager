use rusqlite::Connection;

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
}