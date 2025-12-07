import apiClient from '../../client';

export const customerSubscriptionApi = {
    // Get current subscription
    getMySubscription: async () => {
        const response = await apiClient.get('/customer/subscription/');
        return response.data;
    },

    // Get available plans
    getAvailablePlans: async () => {
        const response = await apiClient.get('/customer/subscription/plans');
        return response.data;
    },

    // Initiate plan upgrade
    upgradePlan: async (planData) => {
        const response = await apiClient.post('/customer/subscription/upgrade', planData);
        return response.data;
    },

    // Get payment history
    getPaymentHistory: async () => {
        const response = await apiClient.get('/customer/subscription/payment-history');
        return response.data;
    },

    // Check module access
    checkModuleAccess: async (moduleName) => {
        const response = await apiClient.get(`/customer/subscription/check-access/${moduleName}`);
        return response.data;
    },

    // Confirm demo payment (for testing)
    confirmDemoPayment: async (transactionId, planId, amount) => {
        const response = await apiClient.post(
            `/customer/subscription/confirm-demo-payment?transaction_id=${transactionId}&plan_id=${planId}&amount=${amount}`
        );
        return response.data;
    },
};
