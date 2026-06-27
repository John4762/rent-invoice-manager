import { useEffect, useState } from "react";
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

interface Tenant {
  id: string;
  tenant_name: string;
  tenant_code: string;
  tenant_gstin: string;
  tenant_address: string;
  location_address: string;
  rent_amount: number;
  cgst_percent: number;
  sgst_percent: number;
  active: boolean;
}

interface EditTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
  onSuccess: () => void;
}

export function EditTenantDialog({
  open,
  onOpenChange,
  tenant,
  onSuccess,
}: EditTenantDialogProps) {
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

  useEffect(() => {
    if (!tenant) return;

    setTenantName(tenant.tenant_name);
    setTenantCode(tenant.tenant_code);
    setTenantGstin(tenant.tenant_gstin);

    setTenantAddress(tenant.tenant_address);
    setLocationAddress(tenant.location_address);

    setRentAmount(tenant.rent_amount);

    setCgstPercent(tenant.cgst_percent);
    setSgstPercent(tenant.sgst_percent);

    setActive(tenant.active);
  }, [tenant]);

  async function handleSave() {
    if (!tenant) return;

    try {
      setLoading(true);

      await invoke("update_tenant", {
        tenant: {
          id: tenant.id,

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
    } catch (error) {
      console.error(error);
      alert("Failed to update tenant");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tenant</DialogTitle>
        </DialogHeader>

        <div>
          TEMP UI
        </div>

        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
