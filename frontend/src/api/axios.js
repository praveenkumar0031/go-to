import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_BACKEND_API //|| 'http://localhost:8000/api/goto';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., remove token)
      localStorage.removeItem('token');
      // We don't automatically redirect here because it could interfere with useQuery
      // We'll let the app handle it via Context or Route wrappers
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
