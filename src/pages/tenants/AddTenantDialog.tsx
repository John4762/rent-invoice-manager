import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTenantDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddTenantDialogProps) {
  const [loading, setLoading] = useState(false);

  const [tenantName, setTenantName] = useState("");
  const [tenantCode, setTenantCode] = useState("");
  const [tenantGstin, setTenantGstin] = useState("");

  const [tenantAddress, setTenantAddress] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  const [rentAmount, setRentAmount] = useState(0);

  const [cgstPercent, setCgstPercent] = useState(9);
  const [sgstPercent, setSgstPercent] = useState(9);

  const [active, setActive] = useState(true);

  async function handleSave() {
    if (!tenantName.trim()) {
      alert("Tenant Name is required");
      return;
    }

    if (!tenantCode.trim()) {
      alert("Tenant Code is required");
      return;
    }

    if (rentAmount <= 0) {
      alert("Rent Amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      await invoke("create_tenant", {
        tenant: {
          tenant_name: tenantName,
          tenant_code: tenantCode,
          tenant_gstin: tenantGstin,

          tenant_address: tenantAddress,
          location_address: locationAddress,

          rent_amount: rentAmount,

          cgst_percent: cgstPercent,
          sgst_percent: sgstPercent,

          active,
        },
      });

      onSuccess();

      onOpenChange(false);

      setTenantName("");
      setTenantCode("");
      setTenantGstin("");
      setTenantAddress("");
      setLocationAddress("");

      setRentAmount(0);

      setCgstPercent(9);
      setSgstPercent(9);

      setActive(true);
    } catch (error) {
      console.error(error);
      alert("Failed to create tenant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
        w-[1100px]
        max-w-[95vw]
        border
        border-zinc-700
        bg-zinc-900
        text-white
        shadow-2xl
      "
      >
        <DialogHeader className="border-b border-zinc-700 pb-5">
          <DialogTitle className="text-3xl font-semibold text-white">
            Add Tenant
          </DialogTitle>

          <p className="text-base text-zinc-400">
            Create a new tenant configuration.
          </p>
        </DialogHeader>

        <div className="space-y-8 py-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Tenant Name</Label>

              <Input
                placeholder="Enter tenant name"
                className="h-12 w-full text-white"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Tenant Code</Label>

              <Input
                placeholder="Enter tenant code (e.g. CP)"
                className="h-12 w-full text-white"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">GSTIN</Label>

            <Input
              placeholder="Enter GSTIN"
              className="h-12 w-full text-white"
              value={tenantGstin}
              onChange={(e) => setTenantGstin(e.target.value)}
            />
          </div>

          <div className="border-t border-zinc-700 pt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Addresses
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Billing Address</Label>

              <Textarea
                placeholder="Enter billing address"
                className="min-h-36 resize-none text-white"
                value={tenantAddress}
                onChange={(e) => setTenantAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Property Address</Label>

              <Textarea
                placeholder="Enter property address"
                className="min-h-36 resize-none text-white"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-zinc-700 pt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Invoice Configuration
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Rent Amount</Label>

              <Input
                type="number"
                className="h-12 w-full text-white"
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">CGST %</Label>

              <Input
                type="number"
                className="h-12 w-full text-white"
                value={cgstPercent}
                onChange={(e) => setCgstPercent(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">SGST %</Label>

              <Input
                type="number"
                className="h-12 w-full text-white"
                value={sgstPercent}
                onChange={(e) => setSgstPercent(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300">Status</Label>

              <Select
                value={active ? "active" : "inactive"}
                onValueChange={(value) => setActive(value === "active")}
              >
                <SelectTrigger className="h-12 w-full text-white">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>

                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-zinc-700 pt-8">
<Button
  variant="ghost"
  className="
    w-32
    border
    border-zinc-700
    text-zinc-300
    hover:bg-zinc-800
    hover:text-white
  "
  onClick={() => onOpenChange(false)}
>
  Cancel
</Button>

            <Button
              onClick={handleSave}
              disabled={loading}
              className="
              w-40
              bg-emerald-500
              text-white
              hover:bg-emerald-600
            "
            >
              {loading ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
