import axiosInstance from "./axiosInstance";
import { AxiosRequestConfig } from "axios";

/**
 * API Client — Reusable typed wrappers for all HTTP methods.
 *
 * Usage:
 *   import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/apiClient";
 *
 *   const data = await apiGet<StockQuote>("/api/stock/quote/AAPL");
 */

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function apiGet<T>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.get<T>(url, { params, ...config });
  return response.data;
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function apiPost<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.post<T>(url, body, config);
  return response.data;
}

// ─── PUT ──────────────────────────────────────────────────────────────────────
export async function apiPut<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.put<T>(url, body, config);
  return response.data;
}

// ─── PATCH ────────────────────────────────────────────────────────────────────
export async function apiPatch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.patch<T>(url, body, config);
  return response.data;
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axiosInstance.delete<T>(url, config);
  return response.data;
}
