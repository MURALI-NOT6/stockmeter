/**
 * Converts a value from USD to the target currency and formats it professionally.
 */
export function formatCurrency(
  value: number | undefined | null,
  rate: number,
  symbol: string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
    compact?: boolean;
  } = {}
): string {
  if (value === undefined || value === null) return "---";

  const convertedValue = value * rate;
  const { compact = false, showSymbol = true } = options;

  if (compact) {
    const formatter = Intl.NumberFormat(undefined, {
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
    return `${showSymbol ? symbol : ""}${formatter.format(convertedValue)}`;
  }

  const formattedValue = convertedValue.toLocaleString(undefined, {
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  });

  return `${showSymbol ? symbol : ""}${formattedValue}`;
}

/**
 * Formats a percentage change with dynamic precision.
 * For very small moves, it shows more decimal places to avoid "0.00%".
 */
export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null) return "---";
  
  const absValue = Math.abs(value);
  
  // If it's zero, just return 0.00%
  if (value === 0) return "0.00%";
  
  // If it rounds to 0.00 with 2 decimals but is actually non-zero
  if (absValue > 0 && absValue < 0.01) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 4,
    }) + "%";
  }

  // Standard 2-decimal format
  return value.toFixed(2) + "%";
}
