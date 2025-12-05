import apiClient from '../client';

export const adminCareersApi = {
  // Get all careers (admin view - all customers)
  getAllCareers: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/careers/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get career by ID
  getCareerById: async (id) => {
    const response = await apiClient.get(`/admin/company/careers/${id}`);
    return response.data;
  },

  // Update career (admin)
  updateCareer: async (id, data) => {
    const response = await apiClient.put(`/admin/company/careers/${id}`, data);
    return response.data;
  },

  // Delete career (admin)
  deleteCareer: async (id) => {
    const response = await apiClient.delete(`/admin/company/careers/${id}`);
    return response.data;
  },
};
