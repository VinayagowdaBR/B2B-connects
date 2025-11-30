import apiClient from '../client';

export const customerApi = {
    getProfile: async () => {
        const response = await apiClient.get('/customer/profile');
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await apiClient.put('/customer/profile', data);
        return response.data;
    },

    // Add more customer endpoints as needed
};
