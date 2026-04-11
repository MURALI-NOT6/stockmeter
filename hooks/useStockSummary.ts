import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { StockSummary } from "@/lib/types/stock";

export function useStockSummary(symbol: string | null) {
  const { data, error, isLoading } = useSWR<StockSummary>(
    symbol ? API_ENDPOINTS.stock.summary(symbol) : null,
    (url: string) => apiGet<StockSummary>(url),
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes cache for summary data
    }
  );

  return {
    summary: data,
    isLoading: isLoading,
    error,
  };
}
