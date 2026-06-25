import { AppSettings } from "@/types/settings";

export interface SettingsRepository {
  get(): Promise<AppSettings | null>;

  save(settings: AppSettings): Promise<void>;
}