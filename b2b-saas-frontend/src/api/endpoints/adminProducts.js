import apiClient from '../client';

export const adminProductsApi = {
  // Get all products (admin view - all customers)
  getAllProducts: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/products/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/admin/company/products/${id}`);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, data) => {
    const response = await apiClient.put(`/admin/company/products/${id}`, data);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/admin/company/products/${id}`);
    return response.data;
  },
};
