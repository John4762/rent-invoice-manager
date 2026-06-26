import { PDFViewer } from "@react-pdf/renderer";
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
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [generatedRun, setGeneratedRun] = useState<GeneratedInvoiceRun | null>(
    null,
  );
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

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
      setPopupMessage("Select at least one tenant before generating invoices.");
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
    setPopupMessage(
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

  function handleProceedToPrintAndEmail() {
    if (!generatedRun) {
      return;
    }

    navigate("/print-email");
  }

  return (
    <div className="space-y-8 text-zinc-100">
      <PageHeader
        title="Generate Invoices"
        description="Create and preview invoices for your tenants."
      />

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <div>
            <label
              htmlFor="cycleMonth"
              className="mb-3 block text-sm font-medium text-zinc-400"
            >
              Cycle
            </label>

            <input
              id="cycleMonth"
              type="month"
              value={cycleMonth}
              onChange={(event) => setCycleMonth(event.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 outline-none transition hover:bg-zinc-900 focus:border-zinc-600"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-400">Tenant List</p>

              <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-500">
                {selectedTenants.length} selected
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {tenantRentalData.map((tenant) => {
                const selected = selectedTenantIds.includes(tenant.tenantId);

                return (
                  <label
                    key={tenant.tenantId}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                      selected
                        ? "border-zinc-600 bg-zinc-800/80"
                        : "border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleTenantToggle(tenant.tenantId)}
                      className="h-4 w-4 accent-zinc-100"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-zinc-100">
                        {tenant.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {tenant.tenantCode} · ₹
                        {tenant.rentAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={handleGenerateInvoices}
            className="rounded-2xl bg-zinc-100 px-10 py-4 text-lg font-semibold text-zinc-950 transition hover:bg-white"
          >
            Generate Invoice
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-semibold text-zinc-100">
            Preview Invoice
          </h2>

          {generatedRun && selectedInvoice ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePreviousInvoice}
                disabled={selectedInvoiceIndex === 0}
                className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-400">
                {selectedInvoiceIndex + 1} / {invoices.length}
              </span>

              <button
                type="button"
                onClick={handleNextInvoice}
                disabled={selectedInvoiceIndex === invoices.length - 1}
                className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>

        {generatedRun && selectedInvoice ? (
          <>
            <div className="grid gap-3 py-5 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Tenant</p>
                <p className="mt-2 truncate text-sm font-semibold text-zinc-100">
                  {selectedInvoice.tenant.name}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Invoice Number</p>
                <p className="mt-2 text-sm font-semibold text-zinc-100">
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3">
              <button
                type="button"
                onClick={() =>
                  setZoom((currentZoom) => Math.max(currentZoom - 0.1, 0.6))
                }
                className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
              >
                Zoom out
              </button>

              <span className="min-w-14 text-center text-sm text-zinc-400">
                {Math.round(zoom * 100)}%
              </span>

              <button
                type="button"
                onClick={() =>
                  setZoom((currentZoom) => Math.min(currentZoom + 0.1, 1.6))
                }
                className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
              >
                Zoom in
              </button>

              <button
                type="button"
                onClick={() => setZoom(1)}
                className="rounded-xl border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
              >
                Reset
              </button>
            </div>

            <div className="h-[78vh] overflow-auto rounded-2xl border border-zinc-800 bg-zinc-950/60">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                }}
              >
                <PDFViewer width="100%" height="100%" showToolbar={false}>
                  <RentalInvoicePdf invoice={selectedInvoice} />
                </PDFViewer>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleProceedToPrintAndEmail}
                className="rounded-2xl bg-zinc-100 px-10 py-4 text-base font-semibold text-zinc-950 transition hover:bg-white"
              >
                Proceed to Print and Email
              </button>
            </div>
          </>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="max-w-sm rounded-3xl border border-zinc-800 bg-zinc-950/40 p-8 text-center">
              <p className="text-lg font-semibold text-zinc-100">
                No invoice generated yet
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Select a cycle and tenants, then generate invoices to preview
                them here.
              </p>
            </div>
          </div>
        )}
      </section>

      {popupMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">
              Invoice generation
            </h2>

            <p className="mt-3 text-sm text-zinc-400">{popupMessage}</p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPopupMessage(null)}
                className="rounded-xl bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}