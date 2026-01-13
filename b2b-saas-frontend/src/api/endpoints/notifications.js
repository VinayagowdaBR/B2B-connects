import api from '../client';

export const notificationsApi = {
    getAll: async (params) => {
        const response = await api.get('/notifications', { params });
        return response.data;
    },
    markRead: async (id) => {
        const response = await api.put(`/notifications/${id}`);
        return response.data;
    },
    markAllRead: async () => {
        const response = await api.put('/notifications/read-all');
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    },
    // Admin function (if user has permission)
    create: async (data) => {
        const response = await api.post('/notifications', data);
        return response.data;
    }
};
