/* =========================
   Finance Utility
   Pure calculation helpers for the
   payment calculator (PreQualify component).
   Uses standard bi-weekly amortization formula.
========================= */

/**
 * APR rates mapped to credit score tiers.
 */
export const APR_MAP: Record<string, number> = {
  Excellent: 6.49,
  Good:      7.99,
  Fair:      9.99,
  Poor:      14.99,
};

/**
 * Calculates the estimated bi-weekly payment.
 *
 * @param loanAmount  - Principal (price - down - tradeIn)
 * @param annualRate  - Annual interest rate as a percentage (e.g. 7.99)
 * @param termMonths  - Loan term in months (e.g. 96)
 * @returns Bi-weekly payment amount, or 0 if inputs are invalid
 */
export function calcBiWeeklyPayment(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): number {
  if (loanAmount <= 0 || annualRate <= 0 || termMonths <= 0) return 0;

  // 26 bi-weekly periods per year
  const termPeriods = (termMonths / 12) * 26;
  const periodRate  = annualRate / 100 / 26;

  return (
    (loanAmount * periodRate * Math.pow(1 + periodRate, termPeriods)) /
    (Math.pow(1 + periodRate, termPeriods) - 1)
  );
}
