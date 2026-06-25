export interface InvoiceCycle {
  month: number;
  year: number;
}

export function isLatestCycle(
  cycle: InvoiceCycle,
  latestCycle: InvoiceCycle,
): boolean {
  return (
    cycle.month === latestCycle.month &&
    cycle.year === latestCycle.year
  );
}

export function canRegenerateCycle(
  cycle: InvoiceCycle,
  latestCycle: InvoiceCycle,
): boolean {
  return isLatestCycle(cycle, latestCycle);
}