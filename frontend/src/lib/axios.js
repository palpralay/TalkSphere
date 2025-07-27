import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

// Add request interceptor to include token in Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;