import { useMemo, useState } from "react";

import { AppContainer } from "@/components/common/AppContainer";
import { PageHeader } from "@/components/common/PageHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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

    tenantAddress: "CP Traders, MG Road, Kochi, Kerala",

    locationAddress: "Warehouse Complex, Kakkanad, Kochi",

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

    tenantAddress: "XYZ Logistics, Ernakulam, Kerala",

    locationAddress: "Container Yard, Kalamassery",

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

    tenantAddress: "ABC Exports, Thrissur, Kerala",

    locationAddress: "Export Warehouse, Angamaly",

    rentAmount: 30000,

    cgstPercent: 9,
    sgstPercent: 9,

    active: false,
  },
];

export function TenantsPage() {
  const [tenants, setTenants] = useState(mockTenants);

  const [selectedTenantId, setSelectedTenantId] = useState(mockTenants[0].id);

  const [isEditing, setIsEditing] = useState(false);

  const selectedTenant = useMemo(
    () => tenants.find((tenant) => tenant.id === selectedTenantId),
    [tenants, selectedTenantId],
  );
  if (!selectedTenant) {
    return null;
  }

  function updateTenant(field: keyof Tenant, value: string | number | boolean) {
    setTenants((current) => {
      const updated = current.map((tenant) =>
        tenant.id === selectedTenantId
          ? {
              ...tenant,
              [field]: value,
            }
          : tenant,
      );

      return updated;
    });
  }

  return (
    <AppContainer>
      <PageHeader
        title="Tenants"
        description="Manage tenant information and contact details."
      />

      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              onClick={() => {
                setSelectedTenantId(tenant.id);
                setIsEditing(false);
              }}
              className={`
                shrink-0
                rounded-xl
                border
                px-4
                py-2
                text-sm
                font-medium
                transition-all
                ${
                  selectedTenantId === tenant.id
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700/60"
                }
              `}
            >
              {tenant.tenantName}
            </button>
          ))}

          <Button variant="outline" className="w-36 shrink-0">
            + Add Tenant
          </Button>
        </div>

        <Card className="border-zinc-700 bg-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl text-white">
                  Tenant Details
                </CardTitle>

                <p className="mt-1 text-sm text-zinc-400">
                  View and manage tenant information.
                </p>
              </div>
              {!isEditing ? (
                <Button
                  className="
    w-36
    border
    border-emerald-500/30
    bg-emerald-500/10
    text-emerald-400
    hover:bg-emerald-500/20
    hover:text-white
  "
                  onClick={() => setIsEditing(true)}
                >
                  ✏ Edit Tenant
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    className="
      w-36
      bg-emerald-500
      text-white
      hover:bg-emerald-600
    "
                    onClick={() => setIsEditing(false)}
                  >
                    Save Changes
                  </Button>

                  <Button
                    variant="outline"
                    className="
      w-36
      border-amber-500/30
      bg-amber-500/10
      text-amber-400
      hover:bg-amber-500/20
      hover:text-white
      hover:border-amber-500/50
    "
                    onClick={() => {
                      updateTenant("active", !selectedTenant.active);
                    }}
                  >
                    {selectedTenant.active ? "Deactivate" : "Activate"}
                  </Button>

                  <Button
                    variant="outline"
                    className="
      w-36
      border-red-500/30
      bg-red-500/10
      text-red-400
      hover:bg-red-500/20
      hover:text-white
      hover:border-red-500/50
    "
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-sm
                  font-medium
                  ${
                    selectedTenant.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }
                `}
              >
                {selectedTenant.active ? "● Active" : "● Inactive"}
              </span>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Tenant Name</Label>

                <Input
                  className={`
  h-11
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  readOnly={!isEditing}
                  value={selectedTenant.tenantName}
                  onChange={(e) => updateTenant("tenantName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Tenant Code</Label>

                <Input
                  className={`
  h-11
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  readOnly={!isEditing}
                  value={selectedTenant.tenantCode}
                  onChange={(e) => updateTenant("tenantCode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">GSTIN</Label>

                <Input
                  className={`
  h-11
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  readOnly={!isEditing}
                  value={selectedTenant.tenantGstin}
                  onChange={(e) => updateTenant("tenantGstin", e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Billing Address</Label>

                <Textarea
                  className={`
  min-h-28
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  readOnly={!isEditing}
                  value={selectedTenant.tenantAddress}
                  onChange={(e) =>
                    updateTenant("tenantAddress", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Property Address</Label>

                <Textarea
                  className={`
  min-h-28
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  readOnly={!isEditing}
                  value={selectedTenant.locationAddress}
                  onChange={(e) =>
                    updateTenant("locationAddress", e.target.value)
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-zinc-300">Rent Amount</Label>

                <Input
                  className={`
  h-11
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  type="number"
                  readOnly={!isEditing}
                  value={selectedTenant.rentAmount}
                  onChange={(e) =>
                    updateTenant("rentAmount", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">CGST %</Label>

                <Input
                  className={`
  h-11
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  type="number"
                  readOnly={!isEditing}
                  value={selectedTenant.cgstPercent}
                  onChange={(e) =>
                    updateTenant("cgstPercent", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">SGST %</Label>

                <Input
                  className={`
  h-11
  text-white
  transition-all
  ${!isEditing ? "opacity-80 border-zinc-700" : "border-emerald-500/30"}
`}
                  type="number"
                  readOnly={!isEditing}
                  value={selectedTenant.sgstPercent}
                  onChange={(e) =>
                    updateTenant("sgstPercent", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppContainer>
  );
}
