export interface Invoice {
  id: string;

  tenantId: string;

  invoiceNumber: string;

  invoiceDate: string;

  invoiceMonth: number;
  invoiceYear: number;

  financialYear: string;

  serialNumber: number;

  rentAmount: number;

  cgstPercent: number;
  cgstAmount: number;

  sgstPercent: number;
  sgstAmount: number;

  totalAmount: number;

  generatedAt: string;
}