import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

interface ArchiveMonth {
  month: string;
}

interface ArchiveInvoice {
  tenant_name: string;
  invoice_number: string;
  total_amount: number;
  email_sent: boolean;
}

interface ArchiveInvoiceDetails {
  tenant_name: string;
  invoice_number: string;
  invoice_date: string;
  rent_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  total_amount: number;
  generated_at: string;
  email_sent: boolean;
  pdf_path: string;
}

export function ArchivePage() {
  const [months, setMonths] = useState<ArchiveMonth[]>([]);

  const [expandedMonth, setExpandedMonth] = useState("");

  const [invoices, setInvoices] = useState<ArchiveInvoice[]>([]);

  const [selectedInvoice, setSelectedInvoice] =
    useState<ArchiveInvoiceDetails | null>(null);

  useEffect(() => {
    loadArchive();
  }, []);

  async function loadArchive() {
    try {
      const months = await invoke<ArchiveMonth[]>("get_available_months");

      setMonths(months);

      if (months.length > 0) {
        await loadMonth(months[0].month);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMonth(monthString: string) {
    const [monthName, yearString] = monthString.split(" ");

    const monthMap: Record<string, number> = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const invoices = await invoke<ArchiveInvoice[]>("get_invoices_for_month", {
      month: monthMap[monthName],
      year: Number(yearString),
    });

    setExpandedMonth(monthString);

    setInvoices(invoices);

    if (invoices.length > 0) {
      await loadInvoiceDetails(invoices[0].invoice_number);
    }
  }

  async function loadInvoiceDetails(invoiceNumber: string) {
    const details = await invoke<ArchiveInvoiceDetails>("get_invoice_details", {
      invoiceNumber,
    });

    setSelectedInvoice(details);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Archive"
        description="View previously generated invoices."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="border-zinc-700 bg-zinc-900">
          <CardContent className="p-0">
            {months.map((month) => (
              <div
                key={month.month}
                className="border-b border-zinc-800 last:border-b-0"
              >
                <button
                  onClick={() => loadMonth(month.month)}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    px-5
                    py-4
                    text-left
                    transition-colors
                    ${
                      expandedMonth === month.month
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-300 hover:bg-zinc-800/50"
                    }
                  `}
                >
                  <span className="text-lg font-semibold">{month.month}</span>

                  <span className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-200">
                    {expandedMonth === month.month ? invoices.length : ""}
                  </span>
                </button>

                {expandedMonth === month.month && (
                  <div className="space-y-2 p-3">
                    {invoices.map((invoice) => (
                      <button
                        key={invoice.invoice_number}
                        onClick={() =>
                          loadInvoiceDetails(invoice.invoice_number)
                        }
                        className={`
                            w-full
                            rounded-xl
                            border
                            p-4
                            text-left
                            transition-all
                            ${
                              selectedInvoice?.invoice_number ===
                              invoice.invoice_number
                                ? "border-zinc-500 border-l-4 border-l-white bg-zinc-700"
                                : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                            }
                          `}
                      >
                        <div className="font-medium text-zinc-100">
                          {invoice.tenant_name}
                        </div>

                        <div className="mt-2 text-xl font-bold text-white">
                          ₹{invoice.total_amount.toLocaleString()}
                        </div>

                        <div className="mt-2 text-xs">
                          {invoice.email_sent ? (
                            <span className="text-green-400">✓ Email Sent</span>
                          ) : (
                            <span className="text-yellow-400">
                              ⚠ Email Failed
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-700 bg-zinc-900">
          <CardContent className="p-8">
            {!selectedInvoice ? (
              <div className="text-zinc-400">Select an invoice</div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">
                    {selectedInvoice.tenant_name}
                  </h1>

                  <p className="mt-2 text-zinc-300">
                    {selectedInvoice.invoice_number}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                    <div className="text-sm text-zinc-400">Rent Amount</div>

                    <div className="mt-2 text-2xl font-semibold text-zinc-100">
                      ₹{selectedInvoice.rent_amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                    <div className="text-sm text-zinc-400">Invoice Date</div>

                    <div className="mt-2 text-2xl font-semibold text-zinc-100">
                      {selectedInvoice.invoice_date}
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                    <div className="text-sm text-zinc-400">CGST</div>

                    <div className="mt-2 text-2xl font-semibold text-zinc-100">
                      ₹{selectedInvoice.cgst_amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                    <div className="text-sm text-zinc-400">SGST</div>

                    <div className="mt-2 text-2xl font-semibold text-zinc-100">
                      ₹{selectedInvoice.sgst_amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-zinc-600 bg-zinc-800 p-6">
                  <div className="text-sm text-zinc-300">Total Amount</div>

                  <div className="mt-3 text-5xl font-bold text-white">
                    ₹{selectedInvoice.total_amount.toLocaleString()}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-zinc-400">Generated</div>

                    <div className="mt-1 text-zinc-100">
                      {selectedInvoice.generated_at}
                    </div>
                  </div>

                  <div>
                    {selectedInvoice.email_sent ? (
                      <span className="rounded-full bg-green-500/10 px-3 py-2 text-green-400">
                        ✓ Email Sent
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-500/10 px-3 py-2 text-yellow-400">
                        ⚠ Email Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
<button
  onClick={async () => {
    try {
      console.log(
        "PDF Path:",
        selectedInvoice?.pdf_path
      );

      await invoke("open_pdf", {
        pdfPath:
          selectedInvoice?.pdf_path,
      });

      alert("Open command sent");
    } catch (error) {
      console.error(error);

      alert(
        `ERROR:\n${JSON.stringify(error)}`
      );
    }
  }}
  className="
    rounded-lg
    bg-white
    px-5
    py-2
    font-medium
    text-black
  "
>
  Open PDF
</button>

                  <button
                    className="
                      rounded-lg
                      border
                      border-zinc-700
                      px-5
                      py-2
                      text-zinc-100
                    "
                  >
                    Email Again
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
