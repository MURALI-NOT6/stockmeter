/**
 * API Constants — Central source of truth for all API endpoint URLs.
 * All API calls must consume these constants rather than hardcoding strings.
 */

// Base URL — reads from environment variable, falls back to relative path for Next.js API routes
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Stock API endpoints
export const API_ENDPOINTS = {
  stock: {
    quote:        (symbol: string) => `/api/stock/quote/${symbol}`,
    chart:        (symbol: string) => `/api/stock/chart/${symbol}`,
    summary:      (symbol: string) => `/api/stock/summary/${symbol}`,
    exchangeRate: (ticker: string) => `/api/stock/exchange-rate/${ticker}`,
  },
} as const;

// Currency ticker mapping
export const CURRENCY_TICKER_MAP: Record<string, { ticker: string; symbol: string }> = {
  "USD ($)": { ticker: "USDUSD=X", symbol: "$" },
  "INR (₹)": { ticker: "USDINR=X", symbol: "₹" },
  "EUR (€)": { ticker: "USDEUR=X", symbol: "€" },
  "GBP (£)": { ticker: "USDGBP=X", symbol: "£" },
};
