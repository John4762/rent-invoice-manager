use crate::database::connection::get_connection;
use crate::models::settings::Settings;
use crate::repositories::settings_repository::SettingsRepository;

#[tauri::command]
pub fn get_settings() -> Option<Settings> {
    let conn = get_connection();

    SettingsRepository::get_settings(&conn)
}

#[tauri::command]
pub fn save_settings(
    settings: Settings,
) {
    let conn = get_connection();

    SettingsRepository::save_settings(
        &conn,
        settings,
    );
}