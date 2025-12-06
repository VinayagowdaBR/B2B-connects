import apiClient from '../../client';

export const customerTeamMembersApi = {
    // Get my team members
    getMyTeamMembers: async () => {
        const response = await apiClient.get('/customer/company/team-members/');
        return response.data;
    },

    // Get single team member
    getTeamMember: async (id) => {
        const response = await apiClient.get(`/customer/company/team-members/${id}`);
        return response.data;
    },

    // Create team member
    createTeamMember: async (data) => {
        const response = await apiClient.post('/customer/company/team-members/', data);
        return response.data;
    },

    // Update team member
    updateTeamMember: async (id, data) => {
        const response = await apiClient.put(`/customer/company/team-members/${id}`, data);
        return response.data;
    },

    // Delete team member
    deleteTeamMember: async (id) => {
        const response = await apiClient.delete(`/customer/company/team-members/${id}`);
        return response.data;
    },
};
