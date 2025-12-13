import apiClient from '../client';

/**
 * Public API endpoints for landing page and public pages
 * These endpoints do not require authentication
 */
export const publicApi = {
    // ============ LANDING PAGE APIs ============

    // Get featured businesses for landing page
    getBusinesses: async (skip = 0, limit = 10, industry = null) => {
        const params = new URLSearchParams({ skip, limit });
        if (industry) params.append('industry', industry);
        const response = await apiClient.get(`/public/businesses?${params}`);
        return response.data;
    },

    // Get latest products for landing page
    getProducts: async (skip = 0, limit = 12, category = null) => {
        const params = new URLSearchParams({ skip, limit });
        if (category) params.append('category', category);
        const response = await apiClient.get(`/public/products?${params}`);
        return response.data;
    },

    // Get latest services for landing page
    getServices: async (skip = 0, limit = 12, category = null) => {
        const params = new URLSearchParams({ skip, limit });
        if (category) params.append('category', category);
        const response = await apiClient.get(`/public/services?${params}`);
        return response.data;
    },

    // Get platform statistics
    getStats: async () => {
        const response = await apiClient.get('/public/stats');
        return response.data;
    },

    // Get categories with counts
    getCategories: async () => {
        const response = await apiClient.get('/public/categories');
        return response.data;
    },

    // ============ SEARCH & FILTER APIs ============

    // Advanced search
    search: async (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.q) searchParams.append('q', params.q);
        if (params.type) searchParams.append('type', params.type);
        if (params.category) searchParams.append('category', params.category);
        if (params.location) searchParams.append('location', params.location);
        if (params.verified) searchParams.append('verified', params.verified);
        if (params.minPrice) searchParams.append('min_price', params.minPrice);
        if (params.maxPrice) searchParams.append('max_price', params.maxPrice);
        if (params.skip) searchParams.append('skip', params.skip);
        if (params.limit) searchParams.append('limit', params.limit);
        const response = await apiClient.get(`/public/search?${searchParams}`);
        return response.data;
    },

    // Get locations for filter
    getLocations: async () => {
        const response = await apiClient.get('/public/locations');
        return response.data;
    },

    // Get industries for filter
    getIndustries: async () => {
        const response = await apiClient.get('/public/industries');
        return response.data;
    },

    // ============ BUSINESS PORTFOLIO APIs ============

    // Get full business portfolio
    getBusinessPortfolio: async (identifier) => {
        const response = await apiClient.get(`/public/business/${identifier}`);
        return response.data;
    },

    // Get public feed (portfolio items)
    getFeed: async (skip = 0, limit = 20, search = null, category = null, itemType = null) => {
        const params = new URLSearchParams({ skip, limit });
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (itemType) params.append('item_type', itemType);
        const response = await apiClient.get(`/public/feed?${params}`);
        return response.data;
    },

    // Get tenant portfolio
    getTenantPortfolio: async (tenantId) => {
        const response = await apiClient.get(`/public/portfolio/${tenantId}`);
        return response.data;
    },

    // Like a portfolio item
    likeItem: async (id) => {
        const response = await apiClient.post(`/public/portfolio/${id}/like`);
        return response.data;
    },

    // ============ DETAIL APIs ============

    // Get product detail
    getProductDetail: async (productId) => {
        const response = await apiClient.get(`/public/product/${productId}`);
        return response.data;
    },

    // Get service detail
    getServiceDetail: async (serviceId) => {
        const response = await apiClient.get(`/public/service/${serviceId}`);
        return response.data;
    },

    // ============ INQUIRY API ============

    // Submit inquiry
    submitInquiry: async (data) => {
        const response = await apiClient.post('/public/inquiries', data);
        return response.data;
    },

    // ============ BLOG & CAREERS APIs ============

    // Get public blog posts
    getBlogs: async (skip = 0, limit = 12, category = null) => {
        const params = new URLSearchParams({ skip, limit });
        if (category) params.append('category', category);
        const response = await apiClient.get(`/public/blogs?${params}`);
        return response.data;
    },

    // Get public careers/jobs
    getCareers: async (skip = 0, limit = 12, filters = {}) => {
        const params = new URLSearchParams({ skip, limit });
        if (filters.location) params.append('location', filters.location);
        if (filters.department) params.append('department', filters.department);
        if (filters.jobType) params.append('job_type', filters.jobType);
        const response = await apiClient.get(`/public/careers?${params}`);
        return response.data;
    }
};

export default publicApi;
