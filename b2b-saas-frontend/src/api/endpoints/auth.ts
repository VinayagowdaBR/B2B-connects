import apiClient from '../client';

// Backend response structure (from your Swagger)
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string | null;
    full_name: string | null;
    phone_number: string | null;
    is_active: boolean;
    is_superuser: boolean;
    customer_type_id: number | null;
    tenant_id: number | null;
  };
}

export interface LoginRequest {
  username: string; // email or phone
  password: string;
}

export interface RegisterRequest {
  email?: string;
  phone_number?: string;
  password: string;
  full_name?: string;
  company_name?: string;
}

export const authApi = {
  // Login with form data (backend expects x-www-form-urlencoded)
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, new_password: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password,
    });
    return response.data;
  },
};
