export interface InvoiceRun {
  id: string;

  cycleMonth: number;
  cycleYear: number;

  generatedAt: string;

  emailSent: boolean;
  emailSentAt?: string;
}