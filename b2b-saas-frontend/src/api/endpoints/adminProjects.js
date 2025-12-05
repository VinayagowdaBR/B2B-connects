import apiClient from '../client';

export const adminProjectsApi = {
  // Get all projects (admin view - all customers)
  getAllProjects: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/projects/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get project by ID
  getProjectById: async (id) => {
    const response = await apiClient.get(`/admin/company/projects/${id}`);
    return response.data;
  },

  // Update project (admin)
  updateProject: async (id, data) => {
    const response = await apiClient.put(`/admin/company/projects/${id}`, data);
    return response.data;
  },

  // Delete project (admin)
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/admin/company/projects/${id}`);
    return response.data;
  },
};
