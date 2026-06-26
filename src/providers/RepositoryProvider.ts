import { MockTenantRepository } from "@/repositories/mock/MockTenantRepository";
import { MockInvoiceRepository } from "@/repositories/mock/MockInvoiceRepository";
import { MockSettingsRepository } from "@/repositories/mock/MockSettingsRepository";

export const repositories = {
  tenant: new MockTenantRepository(),
  invoice: new MockInvoiceRepository(),
  settings: new MockSettingsRepository(),
};
