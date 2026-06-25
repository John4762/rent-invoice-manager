import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { landlordInfo, tenantRentalData } from "@/data/sampleInvoiceData";
import {
  createRentalInvoiceDraft,
  getInvoiceDate,
  getInvoiceMonthLabel,
} from "@/lib/invoiceEngine";
import {
  getExistingInvoiceRecordsForEngine,
  saveGeneratedInvoiceRun,
} from "@/lib/generatedInvoiceStore";

function getCurrentCalendarCycleMonth(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function getCycleMonthLabel(cycleMonth: string): string {
  const [yearText, monthText] = cycleMonth.split("-");

  return getInvoiceMonthLabel(
    getInvoiceDate(Number(yearText), Number(monthText)),
  );
}

export function GenerateInvoicesPage() {
  const navigate = useNavigate();

  const defaultSelectedTenantIds = useMemo(
    () => tenantRentalData.map((tenant) => tenant.tenantId),
    [],
  );

  const [cycleMonth, setCycleMonth] = useState(getCurrentCalendarCycleMonth());
  const [selectedTenantIds, setSelectedTenantIds] = useState<number[]>(
    defaultSelectedTenantIds,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedTenants = tenantRentalData.filter((tenant) =>
    selectedTenantIds.includes(tenant.tenantId),
  );

  function handleTenantToggle(tenantId: number) {
    setSelectedTenantIds((currentTenantIds) => {
      if (currentTenantIds.includes(tenantId)) {
        return currentTenantIds.filter((id) => id !== tenantId);
      }

      return [...currentTenantIds, tenantId];
    });
  }

  function handleGenerateInvoices() {
    if (selectedTenants.length === 0) {
      setStatusMessage("Select at least one tenant before generating invoices.");
      return;
    }

    const existingInvoiceRecords = getExistingInvoiceRecordsForEngine();

    const invoices = selectedTenants.map((tenant) =>
      createRentalInvoiceDraft({
        landlord: landlordInfo,
        tenant,
        cycleMonth,
        rentAmount: tenant.rentAmount,
        sacCode: tenant.sacCode,
        cgstRate: tenant.cgstRate,
        sgstRate: tenant.sgstRate,
        existingInvoices: existingInvoiceRecords,
      }),
    );

    saveGeneratedInvoiceRun({
      cycleMonth,
      invoices,
    });

    navigate("/preview");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate Invoices"
        description="Create new invoices for your tenants."
      />

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="cycleMonth"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Invoice month
            </label>

            <input
              id="cycleMonth"
              type="month"
              value={cycleMonth}
              onChange={(event) => setCycleMonth(event.target.value)}
              className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm"
            />

            <p className="mt-2 text-sm text-gray-500">
              Default is the current calendar month. Selected:{" "}
              <span className="font-medium text-gray-700">
                {getCycleMonthLabel(cycleMonth)}
              </span>
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700">
              Select tenants
            </p>

            <div className="space-y-2">
              {tenantRentalData.map((tenant) => (
                <label
                  key={tenant.tenantId}
                  className="flex items-center gap-3 rounded-md border p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedTenantIds.includes(tenant.tenantId)}
                    onChange={() => handleTenantToggle(tenant.tenantId)}
                  />

                  <span className="font-medium text-gray-900">
                    {tenant.name}
                  </span>

                  <span className="text-gray-500">
                    {tenant.tenantCode} · ₹
                    {tenant.rentAmount.toLocaleString("en-IN")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateInvoices}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Generate Invoices
          </button>

          {statusMessage ? (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              {statusMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}