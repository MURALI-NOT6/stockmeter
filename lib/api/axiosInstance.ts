import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "@/lib/constants/api";

/**
 * Axios Instance — Pre-configured with base URL, timeouts, and interceptors.
 * Import this wherever you need to make HTTP requests.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds — generous for Yahoo Finance calls
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Runs before every outbound request. Use this to attach auth tokens, etc.
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Example: attach bearer token if present
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    if (process.env.NODE_ENV === "development") {
      console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after every inbound response. Use this to handle global errors (401, 500, etc.)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API RESPONSE] ${response.status} ${response.config.url}`,
        response.data
      );
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message || "An unknown error occurred";

    if (status === 401) {
      console.warn("[API] Unauthorized — consider redirecting to login");
    } else if (status === 404) {
      console.warn(`[API] Not found: ${error.config?.url}`);
    } else if (status >= 500) {
      console.error(`[API] Server error (${status}): ${message}`);
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
