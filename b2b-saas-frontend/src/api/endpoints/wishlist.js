import api from '../client';

export const wishlistApi = {
    getAll: async () => {
        const response = await api.get('/wishlist');
        return response.data;
    },
    add: async (data) => {
        const response = await api.post('/wishlist', data);
        return response.data;
    },
    remove: async (productId) => {
        const response = await api.delete(`/wishlist/${productId}`);
        return response.data;
    }
};
