import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { StockChartPoint } from "@/lib/types/stock";

interface UseStockChartOptions {
  symbol: string | null;
  range: string;
}

export function useStockChart({ symbol, range }: UseStockChartOptions) {
  // Interval must match Yahoo Finance valid ranges
  const intervalMap: Record<string, string> = {
    "1d": "15m",
    "5d": "1h",
    "1mo": "1d",
    "3mo": "1d",
    "6mo": "1d",
    "1y": "1d",
  };
  const interval = intervalMap[range] ?? "1d";

  const { data, error, isLoading } = useSWR<StockChartPoint[]>(
    symbol ? [API_ENDPOINTS.stock.chart(symbol), range, interval] : null,
    async ([url, r, i]: [string, string, string]) => {
      const respData = await apiGet<any>(url, { range: r, interval: i });
      
      // Transform Yahoo Finance chart data to Recharts format
      const timestamps = respData.timestamp || [];
      const quote = respData.indicators?.quote?.[0] || {};
      const flatQuotes = respData.quotes || [];

      if (!timestamps.length && !flatQuotes.length) return [];

      if (flatQuotes.length > 0) {
        return flatQuotes.map((q: any) => ({
          date: q.date,
          price: q.close || q.adjclose || q.open || 0,
          open: q.open,
          high: q.high,
          low: q.low,
          volume: q.volume,
        })).filter((p: any) => p.price > 0);
      }

      const prices = quote.close || [];
      const opens = quote.open || [];
      const highs = quote.high || [];
      const lows = quote.low || [];
      const volumes = quote.volume || [];

      return timestamps.map((ts: number, i: number) => ({
        date: new Date(ts * 1000).toISOString(),
        price: prices[i] || opens[i] || 0,
        open: opens[i],
        high: highs[i],
        low: lows[i],
        volume: volumes[i],
      })).filter((p: any) => p.price > 0);
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Chart data doesn't change as frequently as quote
    }
  );

  return {
    chartData: data || [],
    isLoading: isLoading,
    error,
  };
}
