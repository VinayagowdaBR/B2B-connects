import apiClient from '../client';

/**
 * Admin API for managing categories
 */
export const categoriesApi = {
    // Get all categories (admin)
    getAll: async (skip = 0, limit = 100, includeInactive = false) => {
        const params = new URLSearchParams({ skip, limit });
        if (includeInactive) params.append('include_inactive', 'true');
        const response = await apiClient.get(`/admin/categories?${params}`);
        return response.data;
    },

    // Get single category
    getById: async (id) => {
        const response = await apiClient.get(`/admin/categories/${id}`);
        return response.data;
    },

    // Create new category
    create: async (data) => {
        const response = await apiClient.post('/admin/categories', data);
        return response.data;
    },

    // Update category
    update: async (id, data) => {
        const response = await apiClient.put(`/admin/categories/${id}`, data);
        return response.data;
    },

    // Soft delete (deactivate) category
    delete: async (id) => {
        const response = await apiClient.delete(`/admin/categories/${id}`);
        return response.data;
    },

    // Permanently delete category
    permanentDelete: async (id) => {
        const response = await apiClient.delete(`/admin/categories/${id}/permanent`);
        return response.data;
    },

    // Get public categories (no auth required)
    getPublic: async () => {
        const response = await apiClient.get('/public/categories');
        return response.data;
    }
};

export default categoriesApi;
