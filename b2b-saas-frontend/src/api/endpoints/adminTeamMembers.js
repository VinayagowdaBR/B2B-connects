import apiClient from '../client';

export const adminTeamMembersApi = {
  // Get all team members (admin view - all customers)
  getAllTeamMembers: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/team-members/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get team member by ID
  getTeamMemberById: async (id) => {
    const response = await apiClient.get(`/admin/company/team-members/${id}`);
    return response.data;
  },

  // Update team member (admin)
  updateTeamMember: async (id, data) => {
    const response = await apiClient.put(`/admin/company/team-members/${id}`, data);
    return response.data;
  },

  // Delete team member (admin)
  deleteTeamMember: async (id) => {
    const response = await apiClient.delete(`/admin/company/team-members/${id}`);
    return response.data;
  },
};
