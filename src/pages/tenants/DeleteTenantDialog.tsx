import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface DeleteTenantDialogProps {
  open: boolean;
  tenantName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTenantDialog({
  open,
  tenantName,
  onCancel,
  onConfirm,
}: DeleteTenantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
<DialogContent
  className="
    w-[480px]
    border
    border-zinc-700
    bg-zinc-900
    text-white
  "
>
        <DialogHeader>
          <DialogTitle className="text-xl text-red-400">
            Delete Tenant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <p className="text-zinc-400">
            Are you sure you want to delete this tenant?
          </p>

          <div
            className="
      rounded-lg
      border
      border-red-500/20
      bg-red-500/10
      px-4
      py-3
    "
          >
            <p className="font-medium text-white">{tenantName}</p>
          </div>

          <p className="text-sm text-zinc-500">
            This tenant will no longer appear in the application and cannot be
            used for future invoice generation.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="
        border-zinc-700
        bg-zinc-800
        text-zinc-300
        hover:bg-zinc-700
      "
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              className="
        bg-red-500
        text-white
        hover:bg-red-600
      "
            >
              Delete Tenant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
