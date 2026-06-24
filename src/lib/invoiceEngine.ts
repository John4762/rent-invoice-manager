export function getFinancialYear(date: Date): string {
  const year = date.getFullYear();

  if (date.getMonth() >= 3) {
    const start = String(year).slice(-2);
    const end = String(year + 1).slice(-2);
    return `${start}-${end}`;
  }

  const start = String(year - 1).slice(-2);
  const end = String(year).slice(-2);
  return `${start}-${end}`;
}

export function getInvoiceDate(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

export function generateInvoiceNumber(
  tenantCode: string,
  serial: number,
  invoiceDate: Date
): string {
  if (!tenantCode.trim()) {
  throw new Error("Tenant code is required");
}

if (!Number.isInteger(serial) || serial < 1) {
  throw new Error("Serial number must be a positive integer");
}

const fy = getFinancialYear(invoiceDate);
return `AJ/${tenantCode.trim().toUpperCase()}/${serial}/${fy}`;
}

export function getInvoiceMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function getNextInvoiceMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function isSameInvoiceMonth(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

export function canRegenerateInvoice(
  invoiceMonth: Date,
  latestGeneratedMonth: Date
): boolean {
  return isSameInvoiceMonth(invoiceMonth, latestGeneratedMonth);
}

export function isInvoiceMonthLocked(
  invoiceMonth: Date,
  latestGeneratedMonth: Date
): boolean {
  const invoiceKey = getInvoiceMonthKey(invoiceMonth);
  const latestKey = getInvoiceMonthKey(latestGeneratedMonth);

  return invoiceKey < latestKey;
}
export function getNextSerialNumber(
  invoiceDate: Date,
  previousSerial?: number
): number {
  if (invoiceDate.getMonth() === 3) {
    return 1;
  }

  if (previousSerial === undefined) {
    return 1;
  }

  return previousSerial + 1;
}

export type InvoiceCycleState = {
  invoiceMonth: string;
  financialYear: string;
  isLatest: boolean;
  canRegenerate: boolean;
  isLocked: boolean;
};

export function getInvoiceCycleState(
  invoiceMonth: Date,
  latestGeneratedMonth: Date
): InvoiceCycleState {
  const isLatest = isSameInvoiceMonth(invoiceMonth, latestGeneratedMonth);

  return {
    invoiceMonth: getInvoiceMonthKey(invoiceMonth),
    financialYear: getFinancialYear(invoiceMonth),
    isLatest,
    canRegenerate: isLatest,
    isLocked: isInvoiceMonthLocked(invoiceMonth, latestGeneratedMonth),
  };
}

export function getNextInvoiceCycle(
  latestGeneratedMonth?: Date,
  startMonth?: Date
): Date {
  if (!latestGeneratedMonth) {
    if (startMonth) {
      return getInvoiceDate(
        startMonth.getFullYear(),
        startMonth.getMonth() + 1
      );
    }

    return getInvoiceDate(new Date().getFullYear(), 4);
  }

  return getNextInvoiceMonth(latestGeneratedMonth);
}

export function formatInvoiceDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function getInvoiceMonthLabel(date: Date): string {
  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
}