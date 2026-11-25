import axiosClient from './axiosClient';

export function getFines(signal) {
  return axiosClient.get('/fines', { signal });
}

export function payFine(fineId) {
  return axiosClient.patch(`/fines/${fineId}/pay`, {});
}
