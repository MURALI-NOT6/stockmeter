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
