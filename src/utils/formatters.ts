/**
 * Format a number as currency
 * @param value Number to format
 * @param showSign Whether to show + sign for positive numbers
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, showSign = false): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  const formatted = formatter.format(Math.abs(value));
  
  if (value < 0) {
    return `-${formatted}`;
  } else if (value > 0 && showSign) {
    return `+${formatted}`;
  }
  
  return formatted;
}

/**
 * Format a number with thousand separators
 * @param value Number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a percentage
 * @param value Number to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a date
 * @param date Date string or Date object
 * @param format Format to use ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Truncate text to a specific length and add ellipsis
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }
  
  return `${text.substring(0, length)}...`;
}

/**
 * Get a CSS class based on whether a value is positive or negative
 * @param value Number to check
 * @returns CSS class name
 */
export function getValueClass(value: number): string {
  if (value > 0) {
    return 'allocation';
  } else if (value < 0) {
    return 'deallocation';
  }
  return '';
}

/**
 * Get a CSS class for a bar chart bar based on whether a value is positive or negative
 * @param value Number to check
 * @returns CSS class name
 */
export function getBarClass(value: number): string {
  if (value > 0) {
    return 'allocation-bar';
  } else if (value < 0) {
    return 'deallocation-bar';
  }
  return '';
} 