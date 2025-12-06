import apiClient from '../../client';

export const customerCompanyInfoApi = {
    // Get my company info
    getMyCompanyInfo: async () => {
        const response = await apiClient.get('/customer/company/info/');
        return response.data;
    },

    // Update my company info
    updateMyCompanyInfo: async (data) => {
        const response = await apiClient.put('/customer/company/info/', data);
        return response.data;
    },

    // Create company info (first time)
    createCompanyInfo: async (data) => {
        const response = await apiClient.post('/customer/company/info/', data);
        return response.data;
    },
};
