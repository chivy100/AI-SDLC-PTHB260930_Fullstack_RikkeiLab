import axiosClient from './axiosClient';

export function checkHealth(signal) {
  return axiosClient.get('/health', { signal });
}
