import apiClient from '../../client';

export const customerGalleryApi = {
    // Get my gallery images
    getMyGalleryImages: async () => {
        const response = await apiClient.get('/customer/company/gallery-images/');
        return response.data;
    },

    // Get single gallery image
    getGalleryImage: async (id) => {
        const response = await apiClient.get(`/customer/company/gallery-images/${id}`);
        return response.data;
    },

    // Create gallery image
    createGalleryImage: async (data) => {
        const response = await apiClient.post('/customer/company/gallery-images/', data);
        return response.data;
    },

    // Update gallery image
    updateGalleryImage: async (id, data) => {
        const response = await apiClient.put(`/customer/company/gallery-images/${id}`, data);
        return response.data;
    },

    // Delete gallery image
    deleteGalleryImage: async (id) => {
        const response = await apiClient.delete(`/customer/company/gallery-images/${id}`);
        return response.data;
    },
};
