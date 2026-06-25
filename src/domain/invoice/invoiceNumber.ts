interface GenerateInvoiceNumberParams {
  prefix: string;
  tenantCode: string;
  serialNumber: number;
  financialYear: string;
}

export function generateInvoiceNumber({
  prefix,
  tenantCode,
  serialNumber,
  financialYear,
}: GenerateInvoiceNumberParams): string {
  return `${prefix}/${tenantCode}/${serialNumber}/${financialYear}`;
}