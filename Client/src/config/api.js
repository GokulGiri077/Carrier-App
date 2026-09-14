// Central API Configuration
// Reads VITE_API_URL from environment (e.g. Render Dashboard),
// falling back to the live deployed Render URL in production and localhost:5000 in development.
const envUrl = (import.meta.env.VITE_API_URL || '').trim();
const defaultProductionUrl = 'https://carrier-app.onrender.com';
const defaultDevelopmentUrl = 'http://localhost:5000';

const rawBaseUrl = envUrl || (import.meta.env.PROD ? defaultProductionUrl : defaultDevelopmentUrl);

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('carrier_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${formattedEndpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
}

export default API_BASE_URL;
