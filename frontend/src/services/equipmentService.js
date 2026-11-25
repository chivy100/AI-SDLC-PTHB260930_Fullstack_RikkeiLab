import axiosClient from './axiosClient';

export function getEquipments(params = {}, signal) {
  return axiosClient.get('/equipments', { params, signal });
}

export function getEquipmentById(id, signal) {
  return axiosClient.get(`/equipments/${id}`, { signal });
}

export function createEquipment(payload) {
  return axiosClient.post('/equipments', payload);
}

export function updateEquipment(id, payload) {
  return axiosClient.put(`/equipments/${id}`, payload);
}

export function deleteEquipment(id) {
  return axiosClient.delete(`/equipments/${id}`);
}
