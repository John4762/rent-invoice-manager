export interface GeneratedInvoice {
  id: string;

  invoiceId: string;
  tenantId: string;

  invoiceNumber: string;

  pdfPath: string;

  invoiceMonth: number;
  invoiceYear: number;

  generatedAt: string;
}