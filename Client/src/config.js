export const API_BASE_URL = 'http://localhost:5000';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('carrier_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
}
