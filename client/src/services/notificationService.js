import axios from 'axios';

const BASE = 'http://localhost:5000/api/notifications';

export const notificationService = {
    getAll: () => axios.get(BASE).then(r => r.data),
    getUnreadCount: () => axios.get(`${BASE}/unread-count`).then(r => r.data.count),
    markAsRead: (id) => axios.patch(`${BASE}/${id}/read`).then(r => r.data),
};