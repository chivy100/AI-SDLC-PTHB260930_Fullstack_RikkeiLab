import axiosClient from './axiosClient';

export function getBorrowings(status = 'all', signal) {
  return axiosClient.get('/borrowings', {
    params: { status },
    signal,
  });
}

export function createBorrowing(payload) {
  return axiosClient.post('/borrowings', payload);
}

export function returnBorrowing(id) {
  return axiosClient.patch(`/borrowings/${id}/return`);
}
