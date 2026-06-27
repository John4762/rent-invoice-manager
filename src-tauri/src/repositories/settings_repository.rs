use rusqlite::{params, Connection};

use crate::models::settings::Settings;

pub struct SettingsRepository;

impl SettingsRepository {
    pub fn get_settings(
        conn: &Connection,
    ) -> Option<Settings> {
        let mut stmt = conn
            .prepare(
                "
                SELECT
                    landlord_name,
                    pan,
                    gstin,
                    address,
                    invoice_prefix,
                    sac_code,
                    recipient_email,
                    sender_email,
                    gmail_app_password
                FROM settings
                WHERE id = 1
                ",
            )
            .unwrap();

        stmt.query_row([], |row| {
            Ok(Settings {
                landlord_name: row.get(0)?,
                pan: row.get(1)?,
                gstin: row.get(2)?,
                address: row.get(3)?,
                invoice_prefix: row.get(4)?,
                sac_code: row.get(5)?,
                recipient_email: row.get(6)?,
                sender_email: row.get(7)?,
                gmail_app_password: row.get(8)?,
            })
        })
        .ok()
    }

    pub fn save_settings(
        conn: &Connection,
        settings: Settings,
    ) {
        conn.execute(
            "
            UPDATE settings
            SET
                landlord_name = ?,
                pan = ?,
                gstin = ?,
                address = ?,
                invoice_prefix = ?,
                sac_code = ?,
                recipient_email = ?,
                sender_email = ?,
                gmail_app_password = ?
            WHERE id = 1
            ",
            params![
                settings.landlord_name,
                settings.pan,
                settings.gstin,
                settings.address,
                settings.invoice_prefix,
                settings.sac_code,
                settings.recipient_email,
                settings.sender_email,
                settings.gmail_app_password
            ],
        )
        .unwrap();
    }
}