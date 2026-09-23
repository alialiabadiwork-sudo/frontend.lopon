/**
 * Utility functions for formatting numbers, currency, and Persian digits.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Converts English digits in a number or string to Persian digits.
 * @param {number|string} num
 * @returns {string}
 */
export const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  return num.toString().replace(/\d/g, (x) => PERSIAN_DIGITS[parseInt(x, 10)]);
};

/**
 * Formats a numeric price into a comma-separated Persian string.
 * e.g., 277500 -> "۲۷۷,۵۰۰"
 * @param {number|string} price
 * @returns {string}
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') return '۰';
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return '۰';
  const formatted = numericPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return toPersianDigits(formatted);
};
