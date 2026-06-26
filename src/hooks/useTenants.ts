import { useEffect, useState } from "react";
import { repositories } from "@/providers/RepositoryProvider";
import type { Tenant } from "@/types/tenant";

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    repositories.tenant.getAll().then(setTenants);
  }, []);

  return {
    tenants,
  };
}