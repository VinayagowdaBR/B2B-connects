import apiClient from '../client';

export const adminServicesApi = {
  // Get all services (admin view - all customers)
  getAllServices: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/services/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await apiClient.get(`/admin/company/services/${id}`);
    return response.data;
  },

  // Update service (admin)
  updateService: async (id, data) => {
    const response = await apiClient.put(`/admin/company/services/${id}`, data);
    return response.data;
  },

  // Delete service (admin)
  deleteService: async (id) => {
    const response = await apiClient.delete(`/admin/company/services/${id}`);
    return response.data;
  },
};
