import apiClient from '../../client';

export const customerCareersApi = {
    // Get my careers/jobs
    getMyCareers: async () => {
        const response = await apiClient.get('/customer/company/careers/');
        return response.data;
    },

    // Get single career
    getCareer: async (id) => {
        const response = await apiClient.get(`/customer/company/careers/${id}`);
        return response.data;
    },

    // Create career
    createCareer: async (data) => {
        const response = await apiClient.post('/customer/company/careers/', data);
        return response.data;
    },

    // Update career
    updateCareer: async (id, data) => {
        const response = await apiClient.put(`/customer/company/careers/${id}`, data);
        return response.data;
    },

    // Delete career
    deleteCareer: async (id) => {
        const response = await apiClient.delete(`/customer/company/careers/${id}`);
        return response.data;
    },
};
