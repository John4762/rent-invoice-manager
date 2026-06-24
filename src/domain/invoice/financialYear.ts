export function getFinancialYear(year: number, month: number): string {
  const startYear = month >= 4 ? year : year - 1;

  const shortStart = String(startYear).slice(-2);
  const shortEnd = String(startYear + 1).slice(-2);

  return `${shortStart}-${shortEnd}`;
}