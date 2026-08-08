import axios from 'axios';
import { useUserStore } from '@/stores/user';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000
});

request.interceptors.request.use((config) => {
  const user = useUserStore();
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || '请求失败';
    if (err.response?.status === 401) {
      const user = useUserStore();
      user.clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(new Error(msg));
  }
);

export default request;
