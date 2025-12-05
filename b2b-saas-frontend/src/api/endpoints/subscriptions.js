import apiClient from '../client';

export const subscriptionsApi = {
  // ============ PLANS ============
  
  // Get all subscription plans
  getPlans: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/subscriptions/plans?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get plan by ID
  getPlan: async (planId) => {
    const response = await apiClient.get(`/admin/subscriptions/plans/${planId}`);
    return response.data;
  },

  // Create new plan
  createPlan: async (planData) => {
    const response = await apiClient.post('/admin/subscriptions/plans', planData);
    return response.data;
  },

  // Update plan
  updatePlan: async (planId, planData) => {
    const response = await apiClient.put(`/admin/subscriptions/plans/${planId}`, planData);
    return response.data;
  },

  // Delete plan (soft delete)
  deletePlan: async (planId) => {
    const response = await apiClient.delete(`/admin/subscriptions/plans/${planId}`);
    return response.data;
  },

  // Set plan as default
  setDefaultPlan: async (planId) => {
    const response = await apiClient.post(`/admin/subscriptions/plans/${planId}/set-default`);
    return response.data;
  },

  // ============ CUSTOMER SUBSCRIPTIONS ============
  
  // Get all customer subscriptions
  getCustomerSubscriptions: async (skip = 0, limit = 100) => {
    const response = await apiClient.get(`/admin/subscriptions/customers?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Assign subscription to customer
  assignSubscription: async (data) => {
    const response = await apiClient.post('/admin/subscriptions/assign', data);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    const response = await apiClient.post(`/admin/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  },

  // Renew subscription
  renewSubscription: async (subscriptionId) => {
    const response = await apiClient.post(`/admin/subscriptions/${subscriptionId}/renew`);
    return response.data;
  },
};
