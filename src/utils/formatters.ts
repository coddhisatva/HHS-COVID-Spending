/**
 * Format a number as currency
 * @param value - The number to format
 * @param short - Whether to use a shortened format (e.g., $1.2M instead of $1,200,000)
 */
export function formatCurrency(value: number, short: boolean = false): string {
  if (short) {
    const absValue = Math.abs(value);
    if (absValue >= 1_000_000_000) {
      const billions = value / 1_000_000_000;
      return `$${billions.toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
      const millions = value / 1_000_000;
      return `$${millions.toFixed(1)}M`;
    } else if (absValue >= 1_000) {
      const thousands = value / 1_000;
      return `$${thousands.toFixed(0)}K`;
    }
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a percentage
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
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncate a string if it exceeds the maximum length
 */
export function truncateString(str: string, maxLength = 20): string {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * Get a CSS class for positive/negative values
 */
export function getValueClass(value: number): string {
  if (value > 0) return 'allocation';
  if (value < 0) return 'deallocation';
  return '';
}

/**
 * Get a CSS class for bar chart bars based on value
 */
export function getBarClass(value: number): string {
  if (value > 0) return 'allocation-bar';
  if (value < 0) return 'deallocation-bar';
  return '';
}
