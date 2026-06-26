import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

const archiveData = {
  "June 2026": [
    {
      tenantName: "CP Traders",
      invoiceNumber: "AJ/CP/3/26-27",
      rentAmount: 25000,
      cgstAmount: 2250,
      sgstAmount: 2250,
      totalAmount: 29500,
      invoiceDate: "01-Jun-2026",
      generatedAt: "02-Jun-2026 10:05 AM",
      emailSent: true,
    },
    {
      tenantName: "XYZ Logistics",
      invoiceNumber: "AJ/XYZ/3/26-27",
      rentAmount: 40000,
      cgstAmount: 3600,
      sgstAmount: 3600,
      totalAmount: 47200,
      invoiceDate: "01-Jun-2026",
      generatedAt: "02-Jun-2026 10:10 AM",
      emailSent: false,
    },
  ],

  "May 2026": [
    {
      tenantName: "CP Traders",
      invoiceNumber: "AJ/CP/2/26-27",
      rentAmount: 25000,
      cgstAmount: 2250,
      sgstAmount: 2250,
      totalAmount: 29500,
      invoiceDate: "01-May-2026",
      generatedAt: "02-May-2026 09:55 AM",
      emailSent: true,
    },
  ],

  "April 2026": [
    {
      tenantName: "CP Traders",
      invoiceNumber: "AJ/CP/1/26-27",
      rentAmount: 25000,
      cgstAmount: 2250,
      sgstAmount: 2250,
      totalAmount: 29500,
      invoiceDate: "01-Apr-2026",
      generatedAt: "02-Apr-2026 09:30 AM",
      emailSent: true,
    },
  ],
};

export function ArchivePage() {
  const [expandedMonth, setExpandedMonth] =
    useState("June 2026");

  const [selectedInvoice, setSelectedInvoice] =
    useState(archiveData["June 2026"][0]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Archive"
        description="View previously generated invoices."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* LEFT PANEL */}

        <Card className="border-zinc-700 bg-zinc-900">
          <CardContent className="p-0">
            {Object.entries(archiveData).map(
              ([month, invoices]) => (
                <div
                  key={month}
                  className="border-b border-zinc-800 last:border-b-0"
                >
                  <button
                    onClick={() =>
                      setExpandedMonth(
                        expandedMonth === month
                          ? ""
                          : month
                      )
                    }
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
                        expandedMonth === month
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-300 hover:bg-zinc-800/50"
                      }
                    `}
                  >
                    <span className="text-lg font-semibold">
                      {month}
                    </span>

                    <span className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-200">
                      {invoices.length}
                    </span>
                  </button>

                  {expandedMonth === month && (
                    <div className="space-y-2 p-3">
                      {invoices.map((invoice) => (
                        <button
                          key={invoice.invoiceNumber}
                          onClick={() =>
                            setSelectedInvoice(invoice)
                          }
                          className={`
                            w-full
                            rounded-xl
                            border
                            p-4
                            text-left
                            transition-all
                            ${
                              selectedInvoice.invoiceNumber ===
                              invoice.invoiceNumber
                                ? "border-zinc-500 border-l-4 border-l-white bg-zinc-700"
                                : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                            }
                          `}
                        >
                          <div className="font-medium text-zinc-100">
                            {invoice.tenantName}
                          </div>

                          <div className="mt-2 text-xl font-bold text-white">
                            ₹
                            {invoice.totalAmount.toLocaleString()}
                          </div>

                          <div className="mt-2 text-xs">
                            {invoice.emailSent ? (
                              <span className="text-green-400">
                                ✓ Email Sent
                              </span>
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
              )
            )}
          </CardContent>
        </Card>

        {/* RIGHT PANEL */}

        <Card className="border-zinc-700 bg-zinc-900">
          <CardContent className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                {selectedInvoice.tenantName}
              </h1>

              <p className="mt-2 text-zinc-300">
                {selectedInvoice.invoiceNumber}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                <div className="text-sm text-zinc-400">
                  Rent Amount
                </div>

                <div className="mt-2 text-2xl font-semibold text-zinc-100">
                  ₹
                  {selectedInvoice.rentAmount.toLocaleString()}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                <div className="text-sm text-zinc-400">
                  Invoice Date
                </div>

                <div className="mt-2 text-2xl font-semibold text-zinc-100">
                  {selectedInvoice.invoiceDate}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                <div className="text-sm text-zinc-400">
                  CGST
                </div>

                <div className="mt-2 text-2xl font-semibold text-zinc-100">
                  ₹
                  {selectedInvoice.cgstAmount.toLocaleString()}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5">
                <div className="text-sm text-zinc-400">
                  SGST
                </div>

                <div className="mt-2 text-2xl font-semibold text-zinc-100">
                  ₹
                  {selectedInvoice.sgstAmount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-600 bg-zinc-800 p-6">
              <div className="text-sm text-zinc-300">
                Total Amount
              </div>

              <div className="mt-3 text-5xl font-bold text-white">
                ₹
                {selectedInvoice.totalAmount.toLocaleString()}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-400">
                  Generated
                </div>

                <div className="mt-1 text-zinc-100">
                  {selectedInvoice.generatedAt}
                </div>
              </div>

              <div>
                {selectedInvoice.emailSent ? (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}