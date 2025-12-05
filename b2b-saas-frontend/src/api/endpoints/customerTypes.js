import apiClient from '../client';

export const customerTypesApi = {
  // Get all customer types
  getCustomerTypes: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/customer-type/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Create new customer type
  createCustomerType: async (data) => {
    const response = await apiClient.post('/admin/customer-type/', data);
    return response.data;
  },

  // Update customer type
  updateCustomerType: async (customerTypeId, data) => {
    const response = await apiClient.put(`/admin/customer-type/${customerTypeId}`, data);
    return response.data;
  },

  // Delete customer type (soft delete)
  deleteCustomerType: async (customerTypeId) => {
    const response = await apiClient.delete(`/admin/customer-type/${customerTypeId}`);
    return response.data;
  },

  // Set as default customer type
  setDefaultCustomerType: async (customerTypeId) => {
    const response = await apiClient.put(`/admin/customer-type/${customerTypeId}/set-default`);
    return response.data;
  },
};
