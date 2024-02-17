const indianNumberSystem = new Intl.NumberFormat('en-IN');

function convertToInr(
  amount: number,
  maximumFractionDigits: number = 2,
  notation: 'compact' | 'standard' = 'standard'
) {
  if (!amount && amount !== 0) return amount;
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
    notation,
  });
}

export function convertToCompact(amount: number, notation: 'compact' | 'standard' = 'compact') {
  if (!amount && amount !== 0) return amount;
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    notation,
  });
}
export function convertToInrSpaces(amount: number) {
  if (!amount && amount !== 0) return amount;
  return indianNumberSystem.format(amount).replace(/,/g, '_');
}

export default convertToInr;
