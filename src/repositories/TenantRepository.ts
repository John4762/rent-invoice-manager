import { Tenant } from "@/types/tenant";

export interface TenantRepository {
  getAll(): Promise<Tenant[]>;

  getById(id: string): Promise<Tenant | null>;

  create(tenant: Tenant): Promise<void>;

  update(tenant: Tenant): Promise<void>;

  delete(id: string): Promise<void>;
}