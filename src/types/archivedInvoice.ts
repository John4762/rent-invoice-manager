export interface ArchivedInvoice {
  id: string;

  invoiceRunId: string;

  tenantId: string;

  invoiceNumber: string;

  tenantNameSnapshot: string;
  tenantAddressSnapshot: string;
  locationAddressSnapshot: string;

  invoiceDate: string;
  financialYear: string;

  rentAmount: number;

  cgstPercent: number;
  cgstAmount: number;

  sgstPercent: number;
  sgstAmount: number;

  grandTotal: number;

  pdfPath: string;

  generatedAt: string;
}