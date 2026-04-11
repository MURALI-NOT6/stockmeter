import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { StockQuote } from "@/lib/types/stock";

export function useStockQuote(symbol: string | null) {
  const { data, error, isLoading, isValidating } = useSWR<StockQuote>(
    symbol ? API_ENDPOINTS.stock.quote(symbol) : null,
    (url: string) => apiGet<StockQuote>(url),
    {
      refreshInterval: 5000, // 5s polling for "live" feel
      revalidateOnFocus: true,
      dedupingInterval: 2000,
    }
  );

  return {
    quote: data,
    isLoading: isLoading,
    isRefreshing: isValidating,
    error,
  };
}
