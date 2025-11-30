import apiClient from '../client';

export const companyApi = {
    getCompanies: async () => {
        const response = await apiClient.get('/companies');
        return response.data;
    },

    getCompanyById: async (id: string) => {
        const response = await apiClient.get(`/companies/${id}`);
        return response.data;
    },

    createCompany: async (data: any) => {
        const response = await apiClient.post('/companies', data);
        return response.data;
    },

    updateCompany: async (id: string, data: any) => {
        const response = await apiClient.put(`/companies/${id}`, data);
        return response.data;
    },

    deleteCompany: async (id: string) => {
        const response = await apiClient.delete(`/companies/${id}`);
        return response.data;
    },
};
