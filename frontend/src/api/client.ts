import { handleMockApi } from './mockData';

const ENV_URL = (import.meta as any).env?.VITE_API_BASE_URL;
const IS_LOCAL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Connect to live Render cloud backend on production, or local backend when developing locally
const DEFAULT_URL = IS_LOCAL ? 'http://127.0.0.1:8000' : 'https://ayuvista-backend.onrender.com';
const RAW_BASE_URL = ENV_URL !== undefined && ENV_URL !== '' ? ENV_URL : DEFAULT_URL;
const API_BASE = (RAW_BASE_URL ? RAW_BASE_URL.replace(/\/+$/, '') : '') + '/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('nexus_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }

    // If server returned 405, 404, 502, 503 (e.g. backend route missing, static host rewrite, or cold start)
    if (response.status === 405 || response.status === 404 || response.status === 502 || response.status === 503) {
      console.warn(`[AYUVISTA] API returned ${response.status} for ${endpoint}. Falling back to standalone mock engine.`);
      return handleMockApi(endpoint, options) as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    // Check if response is HTML (e.g. SPA index.html returned by static rewrite instead of JSON)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      console.warn(`[AYUVISTA] API returned HTML for ${endpoint}. Falling back to standalone mock engine.`);
      return handleMockApi(endpoint, options) as T;
    }

    if (contentType.includes('text/csv') || contentType.includes('application/xml')) {
      return (await response.text()) as unknown as T;
    }

    return response.json();
  } catch (error: any) {
    // If network error (e.g. backend server offline, CORS, connection refused), fallback seamlessly
    console.warn(`[AYUVISTA] Network notice on ${endpoint}: ${error.message}. Serving from standalone engine.`);
    return handleMockApi(endpoint, options) as T;
  }
}
