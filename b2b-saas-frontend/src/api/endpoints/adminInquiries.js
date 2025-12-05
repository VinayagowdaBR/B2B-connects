import apiClient from '../client';

export const adminInquiriesApi = {
  // Get all inquiries (admin view - all customers)
  getAllInquiries: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/inquiries/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get inquiry by ID
  getInquiryById: async (id) => {
    const response = await apiClient.get(`/admin/company/inquiries/${id}`);
    return response.data;
  },

  // Update inquiry (admin)
  updateInquiry: async (id, data) => {
    const response = await apiClient.put(`/admin/company/inquiries/${id}`, data);
    return response.data;
  },

  // Delete inquiry (admin)
  deleteInquiry: async (id) => {
    const response = await apiClient.delete(`/admin/company/inquiries/${id}`);
    return response.data;
  },
};
