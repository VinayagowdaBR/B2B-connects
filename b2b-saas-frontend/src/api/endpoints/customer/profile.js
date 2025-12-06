import apiClient from '../../client';

export const customerProfileApi = {
    // Get customer home/profile info
    getHome: async () => {
        const response = await apiClient.get('/customer/home');
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await apiClient.get('/customer/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await apiClient.put('/customer/profile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data) => {
        const response = await apiClient.post('/customer/change-password', data);
        return response.data;
    },
};
