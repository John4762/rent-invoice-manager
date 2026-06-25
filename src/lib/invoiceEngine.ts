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

export type ExistingInvoiceRecord = {
  tenantId: number;
  financialYear: string;
  serialNumber: number;
};

export function getLastGeneratedCycle(cycles: string[]): string | null {
  if (cycles.length === 0) {
    return null;
  }

  const sortedCycles = [...cycles].sort();

  return sortedCycles[sortedCycles.length - 1];
}

export function getNextCycle(lastGeneratedCycle: string | null): string {
  if (!lastGeneratedCycle) {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-04`;
  }

  const [yearText, monthText] = lastGeneratedCycle.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  const nextDate = getNextInvoiceMonth(getInvoiceDate(year, month));

  return getInvoiceMonthKey(nextDate);
}

export function canGenerateCycle(
  requestedCycle: string,
  lastGeneratedCycle: string | null
): boolean {
  return requestedCycle === getNextCycle(lastGeneratedCycle);
}

export function canRegenerateCycle(
  requestedCycle: string,
  lastGeneratedCycle: string | null
): boolean {
  if (!lastGeneratedCycle) {
    return false;
  }

  return requestedCycle === lastGeneratedCycle;
}

export function getNextSerialForTenant(
  tenantId: number,
  financialYear: string,
  existingInvoices: ExistingInvoiceRecord[]
): number {
  const tenantInvoicesForFinancialYear = existingInvoices.filter(
    (invoice) =>
      invoice.tenantId === tenantId &&
      invoice.financialYear === financialYear
  );

  if (tenantInvoicesForFinancialYear.length === 0) {
    return 1;
  }

  const highestSerial = Math.max(
    ...tenantInvoicesForFinancialYear.map((invoice) => invoice.serialNumber)
  );

  return highestSerial + 1;
}

export type LandlordInfo = {
  name: string;
  pan: string;
  gstin: string;
  addressLines: string[];
  signatureImageSrc?: string; //image file goes into public

};

export type TenantInfo = {
  tenantId: number;
  tenantCode: string;
  name: string;
  gstin?: string;
  billingAddressLines: string[];
  locationAddressLines: string[];
};

export type RentalInvoiceInput = {
  tenant: TenantInfo;
  landlord: LandlordInfo;
  cycleMonth: string;
  rentAmount: number;
  sacCode?: string;
  cgstRate?: number;
  sgstRate?: number;
  existingInvoices: ExistingInvoiceRecord[];
};

export type RentalInvoiceDraft = {
  landlord: LandlordInfo;
  tenant: TenantInfo;

  invoiceNumber: string;
  invoiceDate: string;
  invoiceMonthLabel: string;

  cycleMonth: string;
  financialYear: string;
  serialNumber: number;

  particulars: string;
  sacCode: string;

  rentAmount: number;
  cgstRate: number;
  sgstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  totalGstAmount: number;
  grandTotal: number;
  grandTotalRounded: number;
  amountInWords: string;

  authorizedSignatory: string;
};

export function calculatePercentageAmount(
  amount: number,
  percentage: number
): number {
  return Number(((amount * percentage) / 100).toFixed(2));
}

export function formatIndianCurrency(amount: number): string {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function createRentalInvoiceDraft(
  input: RentalInvoiceInput
): RentalInvoiceDraft {
  const [yearText, monthText] = input.cycleMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  if (!year || !month || month < 1 || month > 12) {
    throw new Error("Invalid cycle month. Expected format: YYYY-MM");
  }

  const invoiceDateObject = getInvoiceDate(year, month);
  const financialYear = getFinancialYear(invoiceDateObject);

  const serialNumber = getFinancialYearSerialNumber(invoiceDateObject);

  const invoiceNumber = generateInvoiceNumber(
    input.tenant.tenantCode,
    serialNumber,
    invoiceDateObject
  );

  const cgstRate = input.cgstRate ?? 9;
  const sgstRate = input.sgstRate ?? 9;

  const cgstAmount = calculatePercentageAmount(input.rentAmount, cgstRate);
  const sgstAmount = calculatePercentageAmount(input.rentAmount, sgstRate);
  const totalGstAmount = Number((cgstAmount + sgstAmount).toFixed(2));
  const grandTotal = Number((input.rentAmount + totalGstAmount).toFixed(2));
  const grandTotalRounded = Math.round(grandTotal);

  const invoiceMonthLabel = getInvoiceMonthLabel(invoiceDateObject);

  return {
    landlord: input.landlord,
    tenant: {
      ...input.tenant,
      tenantCode: input.tenant.tenantCode.trim().toUpperCase(),
    },

    invoiceNumber,
invoiceDate: formatInvoiceDate(invoiceDateObject).replace(/-/g, "/"),    invoiceMonthLabel,

    cycleMonth: input.cycleMonth,
    financialYear,
    serialNumber,

    particulars: `Rent for ${invoiceMonthLabel}`,
    sacCode: input.sacCode ?? "997212",

    rentAmount: input.rentAmount,
    cgstRate,
    sgstRate,
    cgstAmount,
    sgstAmount,
    totalGstAmount,
    grandTotal,
    grandTotalRounded,
amountInWords: formatAmountInWords(grandTotalRounded),
    authorizedSignatory: input.landlord.name,
  };
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function convertBelowHundred(amount: number): string {
  if (amount < 20) {
    return ONES[amount];
  }

  const ten = Math.floor(amount / 10);
  const one = amount % 10;

  return `${TENS[ten]} ${ONES[one]}`.trim();
}

function convertBelowThousand(amount: number): string {
  const hundred = Math.floor(amount / 100);
  const remainder = amount % 100;

  if (hundred && remainder) {
    return `${ONES[hundred]} Hundred and ${convertBelowHundred(remainder)}`;
  }

  if (hundred) {
    return `${ONES[hundred]} Hundred`;
  }

  return convertBelowHundred(remainder);
}

export function convertNumberToIndianWords(amount: number): string {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative integer");
  }

  if (amount === 0) {
    return "Zero";
  }

  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;

  const lakh = Math.floor(amount / 100000);
  amount %= 100000;

  const thousand = Math.floor(amount / 1000);
  amount %= 1000;

  const parts: string[] = [];

  if (crore) {
    parts.push(`${convertBelowThousand(crore)} Crore`);
  }

  if (lakh) {
    parts.push(`${convertBelowThousand(lakh)} Lakh`);
  }

  if (thousand) {
    parts.push(`${convertBelowThousand(thousand)} Thousand`);
  }

  if (amount) {
    parts.push(convertBelowThousand(amount));
  }

  return parts.join(" ");
}

export function formatAmountInWords(amount: number): string {
  return `Rs. ${convertNumberToIndianWords(Math.round(amount))} Only`;
}

export function getFinancialYearSerialNumber(date: Date): number {
  const month = date.getMonth();

  // April is JS month 3 and is serial 1.
  // May = 2, June = 3, ..., March = 12.
  if (month >= 3) {
    return month - 2;
  }

  return month + 10;
}