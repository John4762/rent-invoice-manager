use crate::database::connection::get_connection;
use crate::models::tenant::Tenant;
use crate::repositories::tenant_repository::TenantRepository;
use crate::models::create_tenant_request::CreateTenantRequest;
use crate::models::update_tenant_request::UpdateTenantRequest;

#[tauri::command]
pub fn get_tenant_count() -> i32 {
    let conn = get_connection();

    TenantRepository::count(&conn)
}

#[tauri::command]
pub fn get_tenants() -> Vec<Tenant> {
    let conn = get_connection();

    TenantRepository::get_all(&conn)
}

#[tauri::command]
pub fn create_tenant(
    tenant: CreateTenantRequest,
) {
    let conn = get_connection();

    TenantRepository::create(
        &conn,
        tenant,
    );
}

#[tauri::command]
pub fn update_tenant(
    tenant: UpdateTenantRequest,
) {
    let conn = get_connection();

    TenantRepository::update(
        &conn,
        tenant,
    );
}

#[tauri::command]
pub fn delete_tenant(
    tenant_id: String,
) {
    let conn = get_connection();

    TenantRepository::delete(
        &conn,
        tenant_id,
    );
}