import type {
  ExistingInvoiceRecord,
  RentalInvoiceDraft,
} from "@/lib/invoiceEngine";

const GENERATED_INVOICE_RUNS_KEY =
  "rent-invoice-manager.generated-invoice-runs";

export type GeneratedInvoiceRun = {
  id: string;
  cycleMonth: string;
  generatedAt: string;
  invoices: RentalInvoiceDraft[];
};

export function getGeneratedInvoiceRuns(): GeneratedInvoiceRun[] {
  const rawValue = localStorage.getItem(GENERATED_INVOICE_RUNS_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue as GeneratedInvoiceRun[];
  } catch {
    return [];
  }
}

export function saveGeneratedInvoiceRun(input: {
  cycleMonth: string;
  invoices: RentalInvoiceDraft[];
}): GeneratedInvoiceRun {
  const currentRuns = getGeneratedInvoiceRuns();

  const newRun: GeneratedInvoiceRun = {
    id: `${input.cycleMonth}-${Date.now()}`,
    cycleMonth: input.cycleMonth,
    generatedAt: new Date().toISOString(),
    invoices: input.invoices,
  };

  const runsWithoutSameCycle = currentRuns.filter(
    (run) => run.cycleMonth !== input.cycleMonth,
  );

  const nextRuns = [newRun, ...runsWithoutSameCycle];

  localStorage.setItem(GENERATED_INVOICE_RUNS_KEY, JSON.stringify(nextRuns));

  return newRun;
}

export function getExistingInvoiceRecordsForEngine(
  cycleMonthToExclude?: string,
): ExistingInvoiceRecord[] {
  const runs = getGeneratedInvoiceRuns();
  const recordMap = new Map<string, ExistingInvoiceRecord>();

  for (const run of runs) {
    for (const invoice of run.invoices) {
      if (cycleMonthToExclude && invoice.cycleMonth === cycleMonthToExclude) {
        continue;
      }

      const record: ExistingInvoiceRecord = {
        tenantId: invoice.tenant.tenantId,
        financialYear: invoice.financialYear,
        serialNumber: invoice.serialNumber,
      };

      const key = [
        record.tenantId,
        record.financialYear,
        record.serialNumber,
      ].join("-");

      recordMap.set(key, record);
    }
  }

  return Array.from(recordMap.values());
}