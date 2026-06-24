export interface GeneratedInvoice {
  id: string;

  invoiceId: string;
  tenantId: string;

  invoiceNumber: string;

  invoiceMonth: number;
  invoiceYear: number;

  pdfPath: string;

  generatedAt: string;
}