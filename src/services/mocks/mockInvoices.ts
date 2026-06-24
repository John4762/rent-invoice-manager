import { Invoice } from "@/types/invoice";

export const mockInvoices: Invoice[] = [
  {
    id: "invoice-001",

    tenantId: "tenant-001",

    invoiceNumber: "AJ/CP/1/26-27",

    invoiceDate: "2026-04-01",

    invoiceMonth: 4,
    invoiceYear: 2026,

    financialYear: "26-27",

    serialNumber: 1,

    rentAmount: 25000,

    cgstPercent: 9,
    cgstAmount: 2250,

    sgstPercent: 9,
    sgstAmount: 2250,

    totalAmount: 29500,

    generatedAt: "2026-04-01T09:00:00Z",
  },

  {
    id: "invoice-002",

    tenantId: "tenant-001",

    invoiceNumber: "AJ/CP/2/26-27",

    invoiceDate: "2026-05-01",

    invoiceMonth: 5,
    invoiceYear: 2026,

    financialYear: "26-27",

    serialNumber: 2,

    rentAmount: 25000,

    cgstPercent: 9,
    cgstAmount: 2250,

    sgstPercent: 9,
    sgstAmount: 2250,

    totalAmount: 29500,

    generatedAt: "2026-05-01T09:00:00Z",
  },

  {
    id: "invoice-003",

    tenantId: "tenant-001",

    invoiceNumber: "AJ/CP/3/26-27",

    invoiceDate: "2026-06-01",

    invoiceMonth: 6,
    invoiceYear: 2026,

    financialYear: "26-27",

    serialNumber: 3,

    rentAmount: 25000,

    cgstPercent: 9,
    cgstAmount: 2250,

    sgstPercent: 9,
    sgstAmount: 2250,

    totalAmount: 29500,

    generatedAt: "2026-06-01T09:00:00Z",
  },
];
