import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { AppContainer } from "@/components/common/AppContainer";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Tenant {
  id: string;

  tenantName: string;
  tenantCode: string;
  tenantGstin: string;

  rentAmount: number;

  active: boolean;
}

const mockTenants: Tenant[] = [
  {
    id: "1",
    tenantName: "CP Traders",
    tenantCode: "CP",
    tenantGstin: "32ABCDE1234F1Z5",
    rentAmount: 25000,
    active: true,
  },
  {
    id: "2",
    tenantName: "XYZ Logistics",
    tenantCode: "XYZ",
    tenantGstin: "32ABCDE5678F1Z5",
    rentAmount: 40000,
    active: true,
  },
  {
    id: "3",
    tenantName: "ABC Exports",
    tenantCode: "ABC",
    tenantGstin: "32ABCDE9999F1Z5",
    rentAmount: 30000,
    active: false,
  },
];

export function TenantsPage() {
  const [tenants] =
    useState(mockTenants);

  return (
    <AppContainer>
      <PageHeader
        title="Tenants"
        description="Manage tenant information and contact details."
      />

      <div className="space-y-6">
        <div className="flex justify-end">
          <Button>
            Add Tenant
          </Button>
        </div>

        <div className="space-y-4">
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className="
                border-zinc-700
                bg-zinc-800/50
                backdrop-blur-sm
              "
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {tenant.tenantName}
                    </h3>

                    <div className="mt-1 text-sm text-zinc-400">
                      Code: {tenant.tenantCode}
                    </div>

                    <div className="mt-1 text-sm text-zinc-400">
                      GSTIN: {tenant.tenantGstin}
                    </div>

                    <div className="mt-3 text-2xl font-bold text-white">
                      ₹
                      {tenant.rentAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-sm
                        ${
                          tenant.active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-zinc-700 text-zinc-400"
                        }
                      `}
                    >
                      {tenant.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                      >
                        {tenant.active
                          ? "Deactivate"
                          : "Activate"}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppContainer>
  );
}