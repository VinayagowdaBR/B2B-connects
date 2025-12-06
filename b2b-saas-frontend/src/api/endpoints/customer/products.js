import apiClient from '../../client';

export const customerProductsApi = {
    // Get my products
    getMyProducts: async () => {
        const response = await apiClient.get('/customer/company/products/');
        return response.data;
    },

    // Get single product
    getProduct: async (id) => {
        const response = await apiClient.get(`/customer/company/products/${id}`);
        return response.data;
    },

    // Create product
    createProduct: async (data) => {
        const response = await apiClient.post('/customer/company/products/', data);
        return response.data;
    },

    // Update product
    updateProduct: async (id, data) => {
        const response = await apiClient.put(`/customer/company/products/${id}`, data);
        return response.data;
    },

    // Delete product
    deleteProduct: async (id) => {
        const response = await apiClient.delete(`/customer/company/products/${id}`);
        return response.data;
    },
};
