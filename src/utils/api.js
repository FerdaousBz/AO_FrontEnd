import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URI;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
export default api;
