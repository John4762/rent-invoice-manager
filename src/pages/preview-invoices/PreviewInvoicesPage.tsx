import { PDFViewer } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  getGeneratedInvoiceRuns,
  type GeneratedInvoiceRun,
} from "@/lib/generatedInvoiceStore";
import { RentalInvoicePdf } from "@/pdf/RentalInvoicePdf";

function formatGeneratedAt(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PreviewInvoicesPage() {
  const runs = useMemo(() => getGeneratedInvoiceRuns(), []);
  const [selectedRunId, setSelectedRunId] = useState(runs[0]?.id ?? "");
  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(0);

  const selectedRun: GeneratedInvoiceRun | undefined = runs.find(
    (run) => run.id === selectedRunId,
  );

  const selectedInvoice = selectedRun?.invoices[selectedInvoiceIndex];

  function handleRunChange(runId: string) {
    setSelectedRunId(runId);
    setSelectedInvoiceIndex(0);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preview Invoices"
        description="Preview your invoices before sending them to tenants."
      />

      {runs.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-gray-700 shadow-sm">
          No generated invoices yet. Go to Generate Invoices and generate a
          cycle first.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="invoiceRun"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Generated run
                </label>

                <select
                  id="invoiceRun"
                  value={selectedRunId}
                  onChange={(event) => handleRunChange(event.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {runs.map((run) => (
                    <option key={run.id} value={run.id}>
                      {run.cycleMonth} — {formatGeneratedAt(run.generatedAt)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Invoices
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedRun?.invoices.map((invoice, index) => (
                    <button
                      key={invoice.invoiceNumber}
                      type="button"
                      onClick={() => setSelectedInvoiceIndex(index)}
                      className={`rounded-md border px-3 py-2 text-sm ${
                        selectedInvoiceIndex === index
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      {invoice.tenant.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {selectedInvoice ? (
            <div className="h-[80vh] overflow-hidden rounded-lg border bg-white shadow-sm">
              <PDFViewer width="100%" height="100%" showToolbar>
                <RentalInvoicePdf invoice={selectedInvoice} />
              </PDFViewer>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}