import apiClient from '../client';

export const companyInfoApi = {
  // Get all company infos (admin view)
  getAllCompanyInfos: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/company/info/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get company info by ID
  getCompanyInfoById: async (id) => {
    const response = await apiClient.get(`/admin/company/info/${id}`);
    return response.data;
  },

  // Update company info (admin)
  updateCompanyInfo: async (id, data) => {
    const response = await apiClient.put(`/admin/company/info/${id}`, data);
    return response.data;
  },
};
