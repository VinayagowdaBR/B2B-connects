import apiClient from '../client';

export const adminGalleryApi = {
  // Get all gallery images (admin view - all customers)
  getAllGalleryImages: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/gallery-images/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get gallery image by ID
  getGalleryImageById: async (id) => {
    const response = await apiClient.get(`/admin/company/gallery-images/${id}`);
    return response.data;
  },

  // Update gallery image (admin)
  updateGalleryImage: async (id, data) => {
    const response = await apiClient.put(`/admin/company/gallery-images/${id}`, data);
    return response.data;
  },

  // Delete gallery image (admin)
  deleteGalleryImage: async (id) => {
    const response = await apiClient.delete(`/admin/company/gallery-images/${id}`);
    return response.data;
  },
};
