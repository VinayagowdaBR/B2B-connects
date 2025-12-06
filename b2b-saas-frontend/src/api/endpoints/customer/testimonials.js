import apiClient from '../../client';

export const customerTestimonialsApi = {
    // Get my testimonials
    getMyTestimonials: async () => {
        const response = await apiClient.get('/customer/company/testimonials/');
        return response.data;
    },

    // Get single testimonial
    getTestimonial: async (id) => {
        const response = await apiClient.get(`/customer/company/testimonials/${id}`);
        return response.data;
    },

    // Create testimonial
    createTestimonial: async (data) => {
        const response = await apiClient.post('/customer/company/testimonials/', data);
        return response.data;
    },

    // Update testimonial
    updateTestimonial: async (id, data) => {
        const response = await apiClient.put(`/customer/company/testimonials/${id}`, data);
        return response.data;
    },

    // Delete testimonial
    deleteTestimonial: async (id) => {
        const response = await apiClient.delete(`/customer/company/testimonials/${id}`);
        return response.data;
    },
};
