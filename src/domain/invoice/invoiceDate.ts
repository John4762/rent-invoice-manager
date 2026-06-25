export function getInvoiceDate(
  month: number,
  year: number,
): string {
  const mm = String(month).padStart(2, "0");

  return `01-${mm}-${year}`;
}