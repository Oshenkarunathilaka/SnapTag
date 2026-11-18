// Centralized API configuration for SnapTag
// In Vite dev mode, requests to /api are proxied to http://localhost:3001 via vite.config.js.
// You can also override the API origin via VITE_API_URL environment variable if needed.
export const API_BASE = import.meta.env.VITE_API_URL ?? '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};

export const getErrorMessage = (err) => {
  if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError') || err?.name === 'TypeError') {
    return 'Cannot reach the backend server. Please ensure the backend is running on http://localhost:3001 (run "node server.js" in the backend directory).';
  }
  return err?.message || 'An unexpected error occurred.';
};
