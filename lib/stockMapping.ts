export const COMPANY_TICKER_MAP: Record<string, string> = {
  "Apple": "AAPL",
  "Tesla": "TSLA",
  "NVIDIA": "NVDA",
  "Microsoft": "MSFT",
  "Amazon": "AMZN",
  "Google": "GOOGL",
};

export const getTicker = (name: string): string => {
  return COMPANY_TICKER_MAP[name] || "AAPL";
};
