import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    try {
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('REFRESH_TOKEN');
        if (refreshToken) {
          const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken
          });
          if (res.status === 200) {
            localStorage.setItem('ACCESS_TOKEN', res.data.access);
            return axiosClient(originalRequest);
          }
        }
      }
    } catch (e) {
      console.log('Refresh token failed:', e);
    }
    throw error;
  }
);

export default axiosClient;
