import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS, CURRENCY_TICKER_MAP } from "@/lib/constants/api";

export function useExchangeRate(currency: string) {
  const { ticker, symbol } = CURRENCY_TICKER_MAP[currency] || CURRENCY_TICKER_MAP["USD ($)"];

  const { data, error, isLoading } = useSWR(
    ticker !== "USDUSD=X" ? API_ENDPOINTS.stock.exchangeRate(ticker) : null,
    async (url: string) => {
      const resp = await apiGet<{ price: number }>(url);
      return resp.price;
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // Cache for 1 hour
    }
  );

  const rate = ticker === "USDUSD=X" ? 1.0 : (data ?? 1.0);

  return {
    exchangeRate: rate,
    currencySymbol: symbol,
    isLoading: ticker !== "USDUSD=X" && isLoading,
    error,
  };
}
