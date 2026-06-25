import { Invoice } from "@/types/invoice";

export interface InvoiceRepository {
  getAll(): Promise<Invoice[]>;

  getById(id: string): Promise<Invoice | null>;

  create(invoice: Invoice): Promise<void>;

  createMany(invoices: Invoice[]): Promise<void>;
}