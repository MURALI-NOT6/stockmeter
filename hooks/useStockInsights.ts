import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { StockInsights } from "@/lib/types/stock";

export function useStockInsights(symbol: string | null) {
  const { data, error, isLoading } = useSWR<StockInsights>(
    symbol ? API_ENDPOINTS.stock.insights(symbol) : null,
    (url: string) => apiGet<StockInsights>(url),
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes cache for AI insights
      shouldRetryOnError: false // Avoid spamming AI API on failures
    }
  );

  return {
    insights: data,
    isLoading: isLoading,
    error: error || data?.error,
  };
}
