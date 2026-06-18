import api from './api.js';

export const equipmentService = {
    getAll:   ()           => api.get('/equipments').then(r => r.data),
    create:   (data)       => api.post('/equipments', data).then(r => r.data),
    update:   (id, data)   => api.put(`/admin/equipments/${id}`, data).then(r => r.data),
    remove:   (id)         => api.delete(`/admin/equipments/${id}`).then(r => r.data),
};