import apiClient from '../../client';

export const customerServicesApi = {
    // Get my services
    getMyServices: async () => {
        const response = await apiClient.get('/customer/company/services/');
        return response.data;
    },

    // Get single service
    getService: async (id) => {
        const response = await apiClient.get(`/customer/company/services/${id}`);
        return response.data;
    },

    // Create service
    createService: async (data) => {
        const response = await apiClient.post('/customer/company/services/', data);
        return response.data;
    },

    // Update service
    updateService: async (id, data) => {
        const response = await apiClient.put(`/customer/company/services/${id}`, data);
        return response.data;
    },

    // Delete service
    deleteService: async (id) => {
        const response = await apiClient.delete(`/customer/company/services/${id}`);
        return response.data;
    },
};
