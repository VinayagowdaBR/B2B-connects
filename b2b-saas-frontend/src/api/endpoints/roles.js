import apiClient from '../client';

export const rolesApi = {
  // Get all roles
  getRoles: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/roles?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Create new role
  createRole: async (roleData) => {
    const response = await apiClient.post('/admin/roles', roleData);
    return response.data;
  },

  // Get all permissions
  getPermissions: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/permissions?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Create new permission
  createPermission: async (permissionData) => {
    const response = await apiClient.post('/admin/permissions', permissionData);
    return response.data;
  },

  // Assign permission to role
  assignPermission: async (roleId, permissionName) => {
    const response = await apiClient.post(`/admin/roles/${roleId}/permissions`, {
      permission_name: permissionName,
    });
    return response.data;
  },

  // Remove permission from role
  removePermission: async (roleId, permissionName) => {
    const response = await apiClient.delete(
      `/admin/roles/${roleId}/permissions/${permissionName}`
    );
    return response.data;
  },
};
