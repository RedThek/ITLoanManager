import api from './api.js';

const BASE = '/notifications'; // relatif à baseURL de api.js

export const notificationService = {
    getAll:          ()   => api.get(BASE).then(r => r.data),
    getUnreadCount:  ()   => api.get(`${BASE}/unread-count`).then(r => r.data.count),
    markAsRead:      (id) => api.patch(`${BASE}/${id}/read`).then(r => r.data),
};