import apiClient from '../client';

export const adminApi = {
    getDashboardStats: async () => {
        const response = await apiClient.get('/admin/dashboard/stats');
        return response.data;
    },

    getUsers: async () => {
        const response = await apiClient.get('/admin/users');
        return response.data;
    },

    // Add more admin endpoints as needed
};
