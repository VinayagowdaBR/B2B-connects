import apiClient from '../../client';

export const customerInquiriesApi = {
    // Get my inquiries
    getMyInquiries: async () => {
        const response = await apiClient.get('/customer/company/inquiries/');
        return response.data;
    },

    // Get single inquiry
    getInquiry: async (id) => {
        const response = await apiClient.get(`/customer/company/inquiries/${id}`);
        return response.data;
    },

    // Create inquiry (response)
    createInquiry: async (data) => {
        const response = await apiClient.post('/customer/company/inquiries/', data);
        return response.data;
    },

    // Update inquiry
    updateInquiry: async (id, data) => {
        const response = await apiClient.put(`/customer/company/inquiries/${id}`, data);
        return response.data;
    },

    // Delete inquiry
    deleteInquiry: async (id) => {
        const response = await apiClient.delete(`/customer/company/inquiries/${id}`);
        return response.data;
    },
};
