use rusqlite::Connection;

pub fn get_connection() -> Connection {
    Connection::open("rent_invoice_manager.db")
        .expect("Failed to open database")
}