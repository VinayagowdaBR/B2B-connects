import apiClient from '../client';

export const usersApi = {
  // Get all users with pagination
  getUsers: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/users?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId, roleName) => {
    const response = await apiClient.post(`/admin/users/${userId}/roles`, { role_name: roleName });
    return response.data;
  },

  // Remove role from user
  removeRole: async (userId, roleName) => {
    const response = await apiClient.delete(`/admin/users/${userId}/roles/${roleName}`);
    return response.data;
  },

  // Get filtered approvals (status: pending, approved, rejected)
  getApprovals: async (status = 'pending', skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/approvals?status=${status}&skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get pending approvals (Legacy)
  getPendingUsers: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/approvals/pending?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Approve user
  approveUser: async (userId) => {
    const response = await apiClient.post(`/admin/approvals/${userId}/approve`);
    return response.data;
  },

  // Reject user
  rejectUser: async (userId) => {
    const response = await apiClient.post(`/admin/approvals/${userId}/reject`);
    return response.data;
  },

  // Reset user to pending
  resetUser: async (userId) => {
    const response = await apiClient.post(`/admin/approvals/${userId}/reset`);
    return response.data;
  },
};
