import { PDFViewer } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { getGeneratedInvoiceRuns } from "@/lib/generatedInvoiceStore";
import { RentalInvoicePdf } from "@/pdf/RentalInvoicePdf";

function formatGeneratedAt(value: string): string {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PreviewInvoicesPage() {
  const generatedRun = useMemo(() => {
    const runs = getGeneratedInvoiceRuns();
    return runs[0] ?? null;
  }, []);

  const [selectedInvoiceIndex, setSelectedInvoiceIndex] = useState(0);

  const invoices = generatedRun?.invoices ?? [];
  const selectedInvoice = invoices[selectedInvoiceIndex];

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
        title="Preview Invoices"
        description="Preview your invoices before sending them to tenants."
      />

      {!generatedRun || invoices.length === 0 ? (
        <div className="rounded-lg border bg-white p-6 text-sm text-gray-700 shadow-sm">
          No generated invoices yet. Go to Generate Invoices and generate a
          cycle first.
        </div>
      ) : (
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
                  {selectedInvoice?.tenant.name} ·{" "}
                  {selectedInvoice?.invoiceNumber}
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

          {selectedInvoice ? (
            <div className="h-[80vh] overflow-hidden rounded-lg border bg-white shadow-sm">
              <PDFViewer width="100%" height="100%" showToolbar={false}>
  <RentalInvoicePdf invoice={selectedInvoice} />
</PDFViewer>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}