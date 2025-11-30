export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const APP_NAME = 'B2B SaaS Platform';

export const ROLES = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    ADMIN_DASHBOARD: '/admin/dashboard',
    CUSTOMER_DASHBOARD: '/customer/dashboard',
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;
