// utils/formatCurrency.ts

/**
 * Formats a numeric amount into a currency string.
 * Defaults to Nigerian Naira (NGN) for clinical transactions.
 * 
 * @param amount - The numeric value to format
 * @param currency - The ISO 4217 currency code (default: 'NGN')
 * @returns A formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  const locale = currency === 'NGN' ? 'en-NG' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'NGN' ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Optional: For formatting without currency symbol
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};