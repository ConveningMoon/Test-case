// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/'; // replace with my API URL !!

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', res.data.access);
          api.defaults.headers['Authorization'] = `Bearer ${res.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (err) {
          console.error('Refresh token expired', err);
          // Optionally, redirect to login
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
