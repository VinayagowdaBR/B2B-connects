import apiClient from '../client';

export const adminBlogPostsApi = {
  // Get all blog posts (admin view - all customers)
  getAllBlogPosts: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/blog-posts/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get blog post by ID
  getBlogPostById: async (id) => {
    const response = await apiClient.get(`/admin/company/blog-posts/${id}`);
    return response.data;
  },

  // Update blog post (admin)
  updateBlogPost: async (id, data) => {
    const response = await apiClient.put(`/admin/company/blog-posts/${id}`, data);
    return response.data;
  },

  // Delete blog post (admin)
  deleteBlogPost: async (id) => {
    const response = await apiClient.delete(`/admin/company/blog-posts/${id}`);
    return response.data;
  },
};
