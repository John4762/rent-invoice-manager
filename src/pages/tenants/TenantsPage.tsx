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

  tenantAddress: string;
  locationAddress: string;

  rentAmount: number;

  cgstPercent: number;
  sgstPercent: number;

  active: boolean;
}

const mockTenants: Tenant[] = [
  {
    id: "1",
    tenantName: "CP Traders",
    tenantCode: "CP",
    tenantGstin: "32ABCDE1234F1Z5",

    tenantAddress:
      "CP Traders, MG Road, Kochi",

    locationAddress:
      "Warehouse Complex, Kakkanad",

    rentAmount: 25000,

    cgstPercent: 9,
    sgstPercent: 9,

    active: true,
  },
  {
    id: "2",
    tenantName: "XYZ Logistics",
    tenantCode: "XYZ",
    tenantGstin: "32ABCDE5678F1Z5",

    tenantAddress:
      "XYZ Logistics, Ernakulam",

    locationAddress:
      "Container Yard, Kalamassery",

    rentAmount: 40000,

    cgstPercent: 9,
    sgstPercent: 9,

    active: true,
  },
  {
    id: "3",
    tenantName: "ABC Exports",
    tenantCode: "ABC",
    tenantGstin: "32ABCDE9999F1Z5",

    tenantAddress:
      "ABC Exports, Thrissur",

    locationAddress:
      "Export Warehouse, Angamaly",

    rentAmount: 30000,

    cgstPercent: 9,
    sgstPercent: 9,

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
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">
                        {tenant.tenantName}
                      </h3>

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-medium
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
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          Tenant Code
                        </div>

                        <div className="text-zinc-200">
                          {tenant.tenantCode}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          GSTIN
                        </div>

                        <div className="text-zinc-200">
                          {tenant.tenantGstin}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          Rent Amount
                        </div>

                        <div className="text-xl font-bold text-white">
                          ₹
                          {tenant.rentAmount.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          Taxes
                        </div>

                        <div className="text-zinc-200">
                          CGST {tenant.cgstPercent}% •
                          {" "}
                          SGST {tenant.sgstPercent}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          Billing Address
                        </div>

                        <div className="mt-1 text-sm text-zinc-300">
                          {tenant.tenantAddress}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          Property Address
                        </div>

                        <div className="mt-1 text-sm text-zinc-300">
                          {tenant.locationAddress}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppContainer>
  );
}