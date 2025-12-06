import apiClient from '../../client';

export const customerProjectsApi = {
    // Get my projects
    getMyProjects: async () => {
        const response = await apiClient.get('/customer/company/projects/');
        return response.data;
    },

    // Get single project
    getProject: async (id) => {
        const response = await apiClient.get(`/customer/company/projects/${id}`);
        return response.data;
    },

    // Create project
    createProject: async (data) => {
        const response = await apiClient.post('/customer/company/projects/', data);
        return response.data;
    },

    // Update project
    updateProject: async (id, data) => {
        const response = await apiClient.put(`/customer/company/projects/${id}`, data);
        return response.data;
    },

    // Delete project
    deleteProject: async (id) => {
        const response = await apiClient.delete(`/customer/company/projects/${id}`);
        return response.data;
    },
};
