import apiClient from '../../client';

export const customerBlogPostsApi = {
    // Get my blog posts
    getMyBlogPosts: async () => {
        const response = await apiClient.get('/customer/company/blog-posts/');
        return response.data;
    },

    // Get single blog post
    getBlogPost: async (id) => {
        const response = await apiClient.get(`/customer/company/blog-posts/${id}`);
        return response.data;
    },

    // Create blog post
    createBlogPost: async (data) => {
        const response = await apiClient.post('/customer/company/blog-posts/', data);
        return response.data;
    },

    // Update blog post
    updateBlogPost: async (id, data) => {
        const response = await apiClient.put(`/customer/company/blog-posts/${id}`, data);
        return response.data;
    },

    // Delete blog post
    deleteBlogPost: async (id) => {
        const response = await apiClient.delete(`/customer/company/blog-posts/${id}`);
        return response.data;
    },
};
