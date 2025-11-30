import apiClient from '../client';

export const locationsApi = {
  // ============ STATES ============
  
  // Get all states
  getStates: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/state/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get state by ID
  getState: async (stateId) => {
    const response = await apiClient.get(`/admin/state/${stateId}`);
    return response.data;
  },

  // Create new state
  createState: async (stateData) => {
    const response = await apiClient.post('/admin/state/', stateData);
    return response.data;
  },

  // Update state
  updateState: async (stateId, stateData) => {
    const response = await apiClient.put(`/admin/state/${stateId}`, stateData);
    return response.data;
  },

  // Delete state
  deleteState: async (stateId) => {
    const response = await apiClient.delete(`/admin/state/${stateId}`);
    return response.data;
  },

  // ============ DISTRICTS ============
  
  // Get all districts (optionally filter by state)
  getDistricts: async (stateId = null, skip = 0, limit = 100) => {
    const params = new URLSearchParams({ skip, limit });
    if (stateId) params.append('state_id', stateId);
    const response = await apiClient.get(`/admin/district/?${params}`);
    return response.data;
  },

  // Get district by ID
  getDistrict: async (districtId) => {
    const response = await apiClient.get(`/admin/district/${districtId}`);
    return response.data;
  },

  // Create new district
  createDistrict: async (districtData) => {
    const response = await apiClient.post('/admin/district/', districtData);
    return response.data;
  },

  // Update district
  updateDistrict: async (districtId, districtData) => {
    const response = await apiClient.put(`/admin/district/${districtId}`, districtData);
    return response.data;
  },

  // Delete district
  deleteDistrict: async (districtId) => {
    const response = await apiClient.delete(`/admin/district/${districtId}`);
    return response.data;
  },
};
