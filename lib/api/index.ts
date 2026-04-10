/**
 * Public surface of the API layer.
 * Import everything from here — do not import from submodules directly.
 *
 * Example:
 *   import { apiGet, apiPost } from "@/lib/api";
 */
export { default as axiosInstance } from "./axiosInstance";
export { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./apiClient";
