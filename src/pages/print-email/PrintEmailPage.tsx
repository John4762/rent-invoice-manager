import { pdf } from "@react-pdf/renderer";
import { Buffer } from "buffer";
import { PDFDocument } from "pdf-lib";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { getGeneratedInvoiceRuns } from "@/lib/generatedInvoiceStore";
import type { RentalInvoiceDraft } from "@/lib/invoiceEngine";
import { RentalInvoicePdf } from "@/pdf/RentalInvoicePdf";

type EmailStatus = "Pending" | "Sending" | "Sent" | "Failed";

const TAX_GUY_EMAIL = "taxguy@gmail.com";

const globalWithBuffer = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer;
};

if (!globalWithBuffer.Buffer) {
  globalWithBuffer.Buffer = Buffer;
}

function getEmailStatusClassName(status: EmailStatus): string {
  if (status === "Sent") {
    return "border-green-900/50 bg-green-950/40 text-green-400";
  }

  if (status === "Sending") {
    return "border-zinc-700 bg-zinc-800 text-zinc-300";
  }

  if (status === "Failed") {
    return "border-amber-900/60 bg-amber-950/40 text-amber-400";
  }

  return "border-zinc-800 bg-zinc-950/50 text-zinc-400";
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function createInvoicePdfBlob(invoice: RentalInvoiceDraft) {
  return pdf(<RentalInvoicePdf invoice={invoice} />).toBlob();
}

async function createCombinedInvoicePdfBlob(invoices: RentalInvoiceDraft[]) {
  const combinedPdf = await PDFDocument.create();

  for (const invoice of invoices) {
    const invoiceBlob = await createInvoicePdfBlob(invoice);
    const invoiceBytes = await invoiceBlob.arrayBuffer();
    const invoicePdf = await PDFDocument.load(invoiceBytes);

    const copiedPages = await combinedPdf.copyPages(
      invoicePdf,
      invoicePdf.getPageIndices(),
    );

    copiedPages.forEach((page) => {
      combinedPdf.addPage(page);
    });
  }

  const combinedBytes = await combinedPdf.save();

  return new Blob([combinedBytes], {
    type: "application/pdf",
  });
}

function downloadPdfBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function getInvoiceFileName(invoice: RentalInvoiceDraft) {
  return `${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`;
}

async function downloadInvoice(invoice: RentalInvoiceDraft) {
  const blob = await createInvoicePdfBlob(invoice);
  downloadPdfBlob(blob, getInvoiceFileName(invoice));
}

async function downloadAllInvoicesSeparately(invoices: RentalInvoiceDraft[]) {
  for (const invoice of invoices) {
    await downloadInvoice(invoice);
    await wait(250);
  }
}

function openPdfPrintDialog(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");

  if (!printWindow) {
    URL.revokeObjectURL(url);
    return false;
  }

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 1200);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);

  return true;
}

async function printInvoice(invoice: RentalInvoiceDraft) {
  const blob = await createInvoicePdfBlob(invoice);
  return openPdfPrintDialog(blob);
}

async function printAllInvoices(invoices: RentalInvoiceDraft[]) {
  const blob = await createCombinedInvoicePdfBlob(invoices);
  return openPdfPrintDialog(blob);
}

export function PrintEmailPage() {
  const navigate = useNavigate();

  const generatedRun = useMemo(() => {
    const runs = getGeneratedInvoiceRuns();
    return runs[0] ?? null;
  }, []);

  const invoices: RentalInvoiceDraft[] = generatedRun?.invoices ?? [];

  const [emailStatus, setEmailStatus] = useState<EmailStatus>("Pending");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const emailSending = emailStatus === "Sending";
  const emailSent = emailStatus === "Sent";

  function handleOpenConfirmModal() {
    if (invoices.length === 0) {
      setActionMessage("No invoices available to send.");
      return;
    }

    setShowConfirmModal(true);
  }

  async function handleConfirmSend() {
    setShowConfirmModal(false);
    setEmailStatus("Sending");
    setActionMessage(null);

    try {
      await wait(900);
      setEmailStatus("Sent");
    } catch {
      setEmailStatus("Failed");
      setActionMessage("Email sending failed. Please try again.");
    }
  }

  async function handlePrintAll() {
    try {
      setActionMessage(null);

      const opened = await printAllInvoices(invoices);

      if (!opened) {
        setActionMessage("Print dialog could not be opened.");
      }
    } catch {
      setActionMessage("Print could not be started.");
    }
  }

  async function handleDownloadAll() {
    try {
      setActionMessage(null);
      await downloadAllInvoicesSeparately(invoices);
    } catch {
      setActionMessage("Download could not be started.");
    }
  }

  async function handlePrintSingle(invoice: RentalInvoiceDraft) {
    try {
      setActionMessage(null);

      const opened = await printInvoice(invoice);

      if (!opened) {
        setActionMessage("Print dialog could not be opened.");
      }
    } catch {
      setActionMessage("Print could not be started.");
    }
  }

  async function handleDownloadSingle(invoice: RentalInvoiceDraft) {
    try {
      setActionMessage(null);
      await downloadInvoice(invoice);
    } catch {
      setActionMessage("Download could not be started.");
    }
  }

  return (
    <div className="space-y-8 text-zinc-100">
      <PageHeader
        title="Print and Email"
        description="Final confirmation before sending invoices to the tax consultant."
      />

      {!generatedRun || invoices.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-sm text-zinc-400">
          No generated invoices found. Go to Generate Invoices and generate
          invoices first.
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
            <h2 className="text-2xl font-semibold text-zinc-100">E-mail</h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.5fr_0.6fr] lg:items-center">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Recipient Email</p>
                <p className="mt-2 text-sm font-semibold text-zinc-100">
                  {TAX_GUY_EMAIL}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Invoice Count</p>
                <p className="mt-2 text-sm font-semibold text-zinc-100">
                  {invoices.length}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Email Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getEmailStatusClassName(
                    emailStatus,
                  )}`}
                >
                  {emailStatus}
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-2xl border border-zinc-800 px-8 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleOpenConfirmModal}
                disabled={emailSending}
                className="rounded-2xl bg-zinc-100 px-8 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Send
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
            <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-zinc-100">
                Print and Download
              </h2>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!emailSent}
                  onClick={handlePrintAll}
                  className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Print All
                </button>

                <button
                  type="button"
                  disabled={!emailSent}
                  onClick={handleDownloadAll}
                  className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download All
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.invoiceNumber}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 transition hover:bg-zinc-900"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-zinc-100">
                        {invoice.tenant.name}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {invoice.invoiceNumber}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!emailSent}
                        onClick={() => handlePrintSingle(invoice)}
                        className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Print
                      </button>

                      <button
                        type="button"
                        disabled={!emailSent}
                        onClick={() => handleDownloadSingle(invoice)}
                        className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {actionMessage ? (
              <div className="mt-6 rounded-2xl border border-amber-900/60 bg-amber-950/40 p-4 text-sm text-amber-400">
                {actionMessage}
              </div>
            ) : null}
          </section>
        </div>
      )}

      {showConfirmModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-zinc-100">
              Confirm email sending
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              This will send one email to{" "}
              <span className="font-semibold text-zinc-100">
                {TAX_GUY_EMAIL}
              </span>{" "}
              with all generated invoices attached.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-zinc-800 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmSend}
                className="rounded-xl bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}