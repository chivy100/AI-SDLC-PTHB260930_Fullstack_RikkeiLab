import axios from 'axios';
import { normalizeApiError } from '../utils/error';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

const baseURL = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
).trim();

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(normalizeApiError(error))
);

export default axiosClient;
