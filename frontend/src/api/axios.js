import axios from 'axios';

// Determine API base URL dynamically
const getBaseURL = () => {
  // 1. Explicitly configured via Vite env variable (e.g. on Vercel)
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.trim().replace(/\/$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  // 2. In production (deployed on Vercel), use the live Render backend URL
  if (import.meta.env.PROD) {
    return 'https://freshcart-1-jec2.onrender.com/api';
  }
  // 3. In development (localhost), use the local Vite proxy
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('freshcart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 (token expired/invalid) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    // Only clear token and redirect if a protected request was unauthorized
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('freshcart_token');
      localStorage.removeItem('freshcart_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
