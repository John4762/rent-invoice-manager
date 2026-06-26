import { PDFViewer } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
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
import type { GeneratedInvoiceRun } from "@/lib/generatedInvoiceStore";
import { RentalInvoicePdf } from "@/pdf/RentalInvoicePdf";

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

function formatGeneratedAt(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function GenerateInvoicesPage() {
  const defaultSelectedTenantIds = useMemo(
    () => tenantRentalData.map((tenant) => tenant.tenantId),
    [],
  );

  const [cycleMonth, setCycleMonth] = useState(getCurrentCalendarCycleMonth());
  const [selectedTenantIds, setSelectedTenantIds] = useState<number[]>(
    defaultSelectedTenantIds,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [generatedRun, setGeneratedRun] = useState<GeneratedInvoiceRun | null>(
    null,
  );
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const selectedTenants = tenantRentalData.filter((tenant) =>
    selectedTenantIds.includes(tenant.tenantId),
  );

  const invoices = generatedRun?.invoices ?? [];
  const selectedInvoice = invoices[selectedInvoiceIndex];

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

    const invoicesForRun = selectedTenants.map((tenant) =>
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

    const savedRun = saveGeneratedInvoiceRun({
      cycleMonth,
      invoices: invoicesForRun,
    });

    setGeneratedRun(savedRun);
    setSelectedInvoiceIndex(0);
    setZoom(1);
    setRotation(0);
    setStatusMessage(
      `Generated ${invoicesForRun.length} invoice(s) for ${getCycleMonthLabel(
        cycleMonth,
      )}.`,
    );
  }

  function handlePreviousInvoice() {
    setSelectedInvoiceIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function handleNextInvoice() {
    setSelectedInvoiceIndex((currentIndex) =>
      Math.min(currentIndex + 1, invoices.length - 1),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate Invoices"
        description="Create and preview invoices for your tenants."
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
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              {statusMessage}
            </div>
          ) : null}
        </div>
      </div>

      {generatedRun && selectedInvoice ? (
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Generated at</p>
                <p className="font-medium text-gray-900">
                  {formatGeneratedAt(generatedRun.generatedAt)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Current invoice</p>
                <p className="font-medium text-gray-900">
                  {selectedInvoice.tenant.name} ·{" "}
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePreviousInvoice}
                  disabled={selectedInvoiceIndex === 0}
                  className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Previous
                </button>

                <span className="text-sm text-gray-700">
                  {selectedInvoiceIndex + 1} / {invoices.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextInvoice}
                  disabled={selectedInvoiceIndex === invoices.length - 1}
                  className="rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() =>
                setZoom((currentZoom) => Math.max(currentZoom - 0.1, 0.6))
              }
              className="rounded-md border px-3 py-2 text-sm"
            >
              Zoom out
            </button>

            <span className="text-sm text-gray-700">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={() =>
                setZoom((currentZoom) => Math.min(currentZoom + 0.1, 1.6))
              }
              className="rounded-md border px-3 py-2 text-sm"
            >
              Zoom in
            </button>

            <button
              type="button"
              onClick={() => setZoom(1)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Reset zoom
            </button>

            <button
              type="button"
              onClick={() =>
                setRotation((currentRotation) => currentRotation + 90)
              }
              className="rounded-md border px-3 py-2 text-sm"
            >
              Rotate
            </button>
          </div>

          <div className="h-[80vh] overflow-auto rounded-lg border bg-white shadow-sm">
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: "top center",
              }}
            >
              <PDFViewer width="100%" height="100%" showToolbar={false}>
                <RentalInvoicePdf invoice={selectedInvoice} />
              </PDFViewer>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}