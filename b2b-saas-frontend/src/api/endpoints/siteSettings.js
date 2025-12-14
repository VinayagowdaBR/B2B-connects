import apiClient from '../client';

/**
 * Site Settings API - Admin endpoints
 */
export const siteSettingsApi = {
    /**
     * Get current site settings (admin)
     */
    getSiteSettings: async () => {
        const response = await apiClient.get('/admin/site-settings/');
        return response.data;
    },

    /**
     * Update site settings (admin)
     */
    updateSiteSettings: async (data) => {
        const response = await apiClient.put('/admin/site-settings/', data);
        return response.data;
    }
};

export default siteSettingsApi;
