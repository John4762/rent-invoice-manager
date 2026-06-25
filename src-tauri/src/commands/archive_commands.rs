use crate::database::connection::get_connection;
use crate::repositories::archive_repository::ArchiveRepository;

#[tauri::command]
pub fn get_archive_invoice_count() -> i32 {
    let conn = get_connection();

    ArchiveRepository::get_invoice_count(
        &conn,
    )
}