export interface Invoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  month: string;
  amount: number;
  dueDate: string;
}