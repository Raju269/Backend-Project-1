const USD_TO_INR = 83.5

export const toINR = (usd) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(usd * USD_TO_INR)
