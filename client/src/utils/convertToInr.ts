const indianNumberSystem = new Intl.NumberFormat('en-IN');
function convertToInr(amount: number) {
  if (!amount && amount !== 0) return amount;
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });
}

export function convertToInrSpaces(amount: number) {
  if (!amount && amount !== 0) return amount;
  return indianNumberSystem.format(amount).replace(/,/g, '_');
}

export default convertToInr;
