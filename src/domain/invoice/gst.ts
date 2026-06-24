export function calculateGst(
  rentAmount: number,
  cgstPercent: number,
  sgstPercent: number,
) {
  const cgstAmount =
    (rentAmount * cgstPercent) / 100;

  const sgstAmount =
    (rentAmount * sgstPercent) / 100;

  const totalAmount =
    rentAmount + cgstAmount + sgstAmount;

  return {
    cgstAmount,
    sgstAmount,
    totalAmount,
  };
}