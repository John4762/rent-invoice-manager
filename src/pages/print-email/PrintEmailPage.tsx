import { invoke } from "@tauri-apps/api/core";
import { pdf } from "@react-pdf/renderer";
import { Buffer } from "buffer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { getGeneratedInvoiceRuns } from "@/lib/generatedInvoiceStore";
import type { RentalInvoiceDraft } from "@/lib/invoiceEngine";
import { RentalInvoicePdf } from "@/pdf/RentalInvoicePdf";

type EmailStatus = "not_sent" | "sending" | "sent" | "failed";

type InvoiceEmailState = {
  status: EmailStatus;
  error?: string;
};

type EmailAttachmentPayload = {
  fileName: string;
  contentBase64: string;
  contentType: string;
};

type AppSettings = {
  landlord_name: string;
  pan: string;
  gstin: string;
  address: string;
  invoice_prefix: string;
  recipient_email: string;
  sender_email: string;
  gmail_app_password: string;
};

type TenantRecord = {
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
  created_at: string;
  updated_at: string;
};

const EMPTY_SETTINGS: AppSettings = {
  landlord_name: "",
  pan: "",
  gstin: "",
  address: "",
  invoice_prefix: "",
  recipient_email: "",
  sender_email: "",
  gmail_app_password: "",
};

const globalWithBuffer = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer;
};

if (!globalWithBuffer.Buffer) {
  globalWithBuffer.Buffer = Buffer;
}

async function loadSettings() {
  return await invoke<AppSettings | null>("get_settings");
}

async function loadTenants() {
  return await invoke<TenantRecord[]>("get_tenants");
}

function getCycleMonthParts(cycleMonth: string) {
  const [yearText, monthText] = cycleMonth.split("-");

  return {
    cycleYear: Number(yearText),
    cycleMonthNumber: Number(monthText),
  };
}

function getInvoiceTenantId(invoice: RentalInvoiceDraft): string {
  const tenantWithSourceId = invoice.tenant as RentalInvoiceDraft["tenant"] & {
    sourceTenantId?: string;
  };

  return (
    tenantWithSourceId.sourceTenantId ??
    `tenant_${invoice.tenant.tenantCode.toLowerCase()}`
  );
}

function joinAddressLines(lines: string[]): string {
  return lines.join("\n");
}


function normaliseTenantCode(code: string): string {
  return code.trim().toUpperCase();
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getStatusLabel(status: EmailStatus): string {
  if (status === "not_sent") {
    return "Not Sent";
  }

  if (status === "sending") {
    return "Sending...";
  }

  if (status === "sent") {
    return "Sent";
  }

  return "Failed";
}

function getStatusClassName(status: EmailStatus): string {
  if (status === "sent") {
    return "border-green-900/50 bg-green-950/40 text-green-400";
  }

  if (status === "sending") {
    return "border-zinc-700 bg-zinc-800 text-zinc-300";
  }

  if (status === "failed") {
    return "border-amber-900/60 bg-amber-950/40 text-amber-400";
  }

  return "border-zinc-800 bg-zinc-950/50 text-zinc-400";
}

function getOverallStatus(invoiceEmailStates: Record<string, InvoiceEmailState>) {
  const states = Object.values(invoiceEmailStates);

  if (states.length === 0) {
    return "not_sent";
  }

  if (states.some((state) => state.status === "sending")) {
    return "sending";
  }

  if (states.some((state) => state.status === "failed")) {
    return "failed";
  }

  if (states.every((state) => state.status === "sent")) {
    return "sent";
  }

  return "not_sent";
}

function getInitialInvoiceEmailStates(invoices: RentalInvoiceDraft[]) {
  return invoices.reduce<Record<string, InvoiceEmailState>>(
    (states, invoice) => {
      states[invoice.invoiceNumber] = {
        status: "not_sent",
      };

      return states;
    },
    {},
  );
}

async function createInvoicePdfBlob(invoice: RentalInvoiceDraft) {
  return pdf(<RentalInvoicePdf invoice={invoice} />).toBlob();
}

function getInvoiceFileName(invoice: RentalInvoiceDraft) {
  return `${invoice.invoiceNumber.replace(/\//g, "-")}.pdf`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.slice(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return window.btoa(binary);
}

async function createInvoiceEmailAttachments(
  invoices: RentalInvoiceDraft[],
  cycleMonthNumber: number,
  cycleYear: number,
): Promise<{
  attachments: EmailAttachmentPayload[];
  archivedPdfPaths: Record<string, string>;
}> {
  const attachments: EmailAttachmentPayload[] = [];

  const archivedPdfPaths: Record<string, string> = {};

  for (const invoice of invoices) {
    const blob = await createInvoicePdfBlob(invoice);
    const buffer = await blob.arrayBuffer();

    const contentBase64 = arrayBufferToBase64(buffer);

    const pdfPath = await invoke<string>(
      "save_invoice_pdf",
      {
        invoiceNumber: invoice.invoiceNumber,
        cycleMonth: cycleMonthNumber,
        cycleYear,
        pdfBase64: contentBase64,
      },
    );

    archivedPdfPaths[invoice.invoiceNumber] = pdfPath;

    attachments.push({
      fileName: getInvoiceFileName(invoice),
      contentBase64,
      contentType: "application/pdf",
    });
  }

  return {
    attachments,
    archivedPdfPaths,
  };
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

export function PrintEmailPage() {
  const navigate = useNavigate();

  const generatedRun = useMemo(() => {
    const runs = getGeneratedInvoiceRuns();
    return runs[0] ?? null;
  }, []);

  const rawInvoices: RentalInvoiceDraft[] = generatedRun?.invoices ?? [];

  const [activeTenantCodes, setActiveTenantCodes] = useState<Set<string>>(
    () => new Set(),
  );
  const [tenantDataLoaded, setTenantDataLoaded] = useState(false);
  const [invoiceEmailStates, setInvoiceEmailStates] = useState<
    Record<string, InvoiceEmailState>
  >(() => getInitialInvoiceEmailStates(rawInvoices));
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(EMPTY_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchSettings() {
      try {
        const loadedSettings = await loadSettings();

        if (!mounted) {
          return;
        }

        if (loadedSettings) {
          setSettings(loadedSettings);
        }
      } catch (error) {
        if (mounted) {
          setActionMessage(`Could not load Settings: ${String(error)}`);
        }
      } finally {
        if (mounted) {
          setSettingsLoaded(true);
        }
      }
    }

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchTenants() {
      try {
        const tenants = await loadTenants();

        if (!mounted) {
          return;
        }

        setActiveTenantCodes(
  new Set(
    tenants
      .filter((tenant) => tenant.active)
      .map((tenant) => normaliseTenantCode(tenant.tenant_code)),
  ),
);
      } catch (error) {
        if (mounted) {
          setActionMessage(`Could not load active tenants: ${String(error)}`);
        }
      } finally {
        if (mounted) {
          setTenantDataLoaded(true);
        }
      }
    }

    fetchTenants();

    return () => {
      mounted = false;
    };
  }, []);

  const invoices = useMemo(() => {
    if (!tenantDataLoaded) {
      return rawInvoices;
    }

    return rawInvoices.filter((invoice) =>
  activeTenantCodes.has(normaliseTenantCode(invoice.tenant.tenantCode)),
);
  }, [activeTenantCodes, rawInvoices, tenantDataLoaded]);

  const overallStatus = getOverallStatus(
    invoices.reduce<Record<string, InvoiceEmailState>>((states, invoice) => {
      states[invoice.invoiceNumber] = invoiceEmailStates[
        invoice.invoiceNumber
      ] ?? {
        status: "not_sent",
      };

      return states;
    }, {}),
  );

  const sending = overallStatus === "sending";
  const allSent = overallStatus === "sent";

  const retryableInvoices = invoices.filter((invoice) => {
    const state = invoiceEmailStates[invoice.invoiceNumber];

    return state?.status === "not_sent" || state?.status === "failed";
  });

  const showRetrySendButton = overallStatus === "failed";

  function setInvoicesToStatus(
    targetInvoices: RentalInvoiceDraft[],
    status: EmailStatus,
    error?: string,
  ) {
    setInvoiceEmailStates((currentStates) => {
      const nextStates = { ...currentStates };

      for (const invoice of targetInvoices) {
        nextStates[invoice.invoiceNumber] = {
          status,
          error,
        };
      }

      return nextStates;
    });
  }

  function validateBeforeSend() {
    if (invoices.length === 0) {
      setActionMessage("No active invoices available to send.");
      return false;
    }

    if (!tenantDataLoaded) {
      setActionMessage("Active tenant data is still loading.");
      return false;
    }

    if (!settingsLoaded) {
      setActionMessage("Settings are still loading.");
      return false;
    }

    if (!settings.sender_email.trim()) {
      setActionMessage("Sender email is missing in Settings.");
      return false;
    }

    if (!settings.recipient_email.trim()) {
      setActionMessage("Recipient email is missing in Settings.");
      return false;
    }

    if (!settings.gmail_app_password.trim()) {
      setActionMessage("Gmail app password is missing in Settings.");
      return false;
    }

    return true;
  }

  function handleOpenConfirmModal() {
    if (!validateBeforeSend()) {
      return;
    }

    setShowConfirmModal(true);
  }

  async function sendInvoicesByEmail(targetInvoices: RentalInvoiceDraft[]) {
    if (!validateBeforeSend()) {
      return;
    }

    if (targetInvoices.length === 0) {
      setActionMessage("No not-sent or failed invoices available to send.");
      return;
    }

    setActionMessage(null);
    setInvoicesToStatus(targetInvoices, "sending");

    try {
      const { cycleMonthNumber, cycleYear } = getCycleMonthParts(
  generatedRun?.cycleMonth ?? "",
);

const {
  attachments,
  archivedPdfPaths,
} = await createInvoiceEmailAttachments(
  targetInvoices,
  cycleMonthNumber,
  cycleYear,
);

      await invoke("send_invoice_email", {
        payload: {
          senderEmail: settings.sender_email,
          recipientEmail: settings.recipient_email,
          gmailAppPassword: settings.gmail_app_password,
          subject: "Rental invoices",
          body: "Please find attached the generated rental invoices.",
          attachments,
        },
      });

      await invoke("archive_sent_invoices", {
        payload: {
          cycleMonth: cycleMonthNumber,
          cycleYear,
          generatedAt: new Date().toISOString(),
          invoices: targetInvoices.map((invoice) => ({
            tenantId: getInvoiceTenantId(invoice),
            invoiceNumber: invoice.invoiceNumber,
            tenantName: invoice.tenant.name,
            tenantAddress: joinAddressLines(invoice.tenant.billingAddressLines),
            locationAddress: joinAddressLines(
              invoice.tenant.locationAddressLines,
            ),
            invoiceDate: invoice.invoiceDate,
            financialYear: invoice.financialYear,
            rentAmount: invoice.rentAmount,
            cgstPercent: invoice.cgstRate,
            cgstAmount: invoice.cgstAmount,
            sgstPercent: invoice.sgstRate,
            sgstAmount: invoice.sgstAmount,
            grandTotal: invoice.grandTotalRounded,
            pdfPath: archivedPdfPaths[invoice.invoiceNumber],
          })),
        },
      });

      setInvoicesToStatus(targetInvoices, "sent");
    } catch (error) {
      const message = String(error);

      setInvoicesToStatus(targetInvoices, "failed", message);
      setActionMessage(message);
    }
  }

  async function handleConfirmSend() {
    setShowConfirmModal(false);
    await sendInvoicesByEmail(retryableInvoices);
  }

  async function handleRetrySend() {
    await sendInvoicesByEmail(retryableInvoices);
  }

  function handlePrintAll() {
    setActionMessage("Native print integration is pending.");
  }

  function handlePrintSingle() {
    setActionMessage("Native print integration is pending.");
  }

  async function handleDownloadAll() {
    try {
      setActionMessage(null);
      await downloadAllInvoicesSeparately(invoices);
    } catch {
      setActionMessage("Download could not be started.");
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

      {!generatedRun || rawInvoices.length === 0 ? (
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
                  {settings.recipient_email || "Not configured"}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Active Invoice Count</p>
                <p className="mt-2 text-sm font-semibold text-zinc-100">
                  {invoices.length}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-xs text-zinc-500">Email Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                    overallStatus,
                  )}`}
                >
                  {getStatusLabel(overallStatus)}
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

              {showRetrySendButton ? (
                <button
                  type="button"
                  onClick={handleRetrySend}
                  disabled={sending}
                  className="rounded-2xl border border-amber-900/60 px-8 py-3 text-sm font-semibold text-amber-400 transition hover:bg-amber-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Retry Send
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleOpenConfirmModal}
                disabled={sending || allSent}
                className="rounded-2xl bg-zinc-100 px-8 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {allSent ? "Sent" : "Confirm Send"}
              </button>
            </div>
                        {actionMessage ? (
              <div className="mt-6 rounded-2xl border border-amber-900/60 bg-amber-950/40 p-4 text-sm text-amber-400">
                {actionMessage}
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8">
            <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold text-zinc-100">
                Print and Download
              </h2>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!allSent}
                  onClick={handlePrintAll}
                  className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Print All
                </button>

                <button
                  type="button"
                  disabled={!allSent}
                  onClick={handleDownloadAll}
                  className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Download All
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {invoices.length === 0 ? (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm text-zinc-400">
                  No active invoices available. Generate invoices again after
                  confirming active tenants.
                </div>
              ) : (
                invoices.map((invoice) => {
                  const emailState = invoiceEmailStates[
                    invoice.invoiceNumber
                  ] ?? {
                    status: "not_sent",
                  };

                  return (
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

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                            emailState.status,
                          )}`}
                        >
                          {getStatusLabel(emailState.status)}
                        </span>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={!allSent}
                            onClick={handlePrintSingle}
                            className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Print
                          </button>

                          <button
                            type="button"
                            disabled={!allSent}
                            onClick={() => handleDownloadSingle(invoice)}
                            className="rounded-xl border border-zinc-800 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            
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
                {settings.recipient_email || "Not configured"}
              </span>{" "}
              with all active not-sent or failed invoices attached.
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