import { TenantRepository } from "../TenantRepository";
import { Tenant } from "@/types/tenant";
import { mockTenants } from "@/services/mocks/mockTenants";

export class MockTenantRepository
  implements TenantRepository
{
  async getAll(): Promise<Tenant[]> {
    return mockTenants;
  }

  async getById(id: string): Promise<Tenant | null> {
    return (
      mockTenants.find((tenant) => tenant.id === id) ??
      null
    );
  }

  async create(): Promise<void> {
    throw new Error("Not implemented");
  }

  async update(): Promise<void> {
    throw new Error("Not implemented");
  }

  async delete(): Promise<void> {
    throw new Error("Not implemented");
  }
}