use crate::database::connection::get_connection;
use crate::repositories::tenant_repository::TenantRepository;

#[tauri::command]
pub fn get_tenant_count() -> i32 {
    let conn = get_connection();

    TenantRepository::count(&conn)
}