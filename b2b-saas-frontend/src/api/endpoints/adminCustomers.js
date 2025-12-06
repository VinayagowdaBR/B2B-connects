import apiClient from '../client';

export const adminCustomersApi = {
    // Get all customers with pagination and search
    getCustomers: async (page = 1, limit = 100, search = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (search) {
            params.append('search', search);
        }
        const response = await apiClient.get(`/admin/customers?${params.toString()}`);
        return response.data;
    },

    // Get customer detail with company and subscription info
    getCustomer: async (customerId) => {
        const response = await apiClient.get(`/admin/customers/${customerId}`);
        return response.data;
    },

    // Update customer
    updateCustomer: async (customerId, customerData) => {
        const response = await apiClient.put(`/admin/customers/${customerId}`, customerData);
        return response.data;
    },
};
