import apiClient from '../client';

export const adminTestimonialsApi = {
  // Get all testimonials (admin view - all customers)
  getAllTestimonials: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/testimonials/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get testimonial by ID
  getTestimonialById: async (id) => {
    const response = await apiClient.get(`/admin/company/testimonials/${id}`);
    return response.data;
  },

  // Update testimonial (admin)
  updateTestimonial: async (id, data) => {
    const response = await apiClient.put(`/admin/company/testimonials/${id}`, data);
    return response.data;
  },

  // Delete testimonial (admin)
  deleteTestimonial: async (id) => {
    const response = await apiClient.delete(`/admin/company/testimonials/${id}`);
    return response.data;
  },
};
