/**
 * Centralized API configuration.
 * - In local development: defaults to '' (using Vite's proxy) or VITE_API_URL.
 * - In production (e.g., Vercel): connects directly to deployed FastAPI backend via VITE_API_URL.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/api/search`,
  priorArt: `${API_BASE_URL}/api/prior-art`,
  demandSignals: `${API_BASE_URL}/api/demand-signals`,
  patents: `${API_BASE_URL}/api/patents`,
  health: `${API_BASE_URL}/api/health`,
};
