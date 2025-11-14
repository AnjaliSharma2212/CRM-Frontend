import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
            ? 'https://crm-system-1-auch.onrender.com/api'
            : 'http://localhost:4000/api' // backend API URL

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
