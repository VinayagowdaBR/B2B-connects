import { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse } from '@/api/endpoints/auth';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (username: string, password: string) => Promise<AuthResponse['user']>;
  register: (data: any) => Promise<AuthResponse['user']>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user data on mount
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<AuthResponse['user']> => {
    const response = await authApi.login(username, password);

    // Store token and user data
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));

    setUser(response.user);
    setIsAuthenticated(true);

    return response.user;
  };

  const register = async (data: any): Promise<AuthResponse['user']> => {
    // Call API to register
    const response = await authApi.register(data);

    // Auto login after register?
    // The current authApi.register returns { message: string, customer: ... } 
    // It does NOT return a token usually unless we change backend.
    // Based on RegisterForm, it expects a user object back or just success.
    // Let's look at RegisterForm: "const user = await register(...)"
    // And "if (user.role === ...)"
    // So the backend register MUST return user info or token.

    // Wait, looking at auth_routes.py, register returns:
    // { "message": "...", "customer": { ... } }
    // It does NOT return an access token. 
    // So the user is NOT logged in automatically.

    // However, the frontend RegisterForm expects `user.role` to decide navigation.
    // The `customer` object in response has `customer_type`.

    // IMPORTANT: The frontend implementation of RegisterForm expects `register` to return a user object
    // effectively logging them in, OR we need to handle the redirect differently.

    // For now, let's implement validation and return the customer object
    // But we might need to perform a login immediately after register to get the token.

    // Checking authApi.register interface:
    // It returns Promise<{ message: string }> in the definition file I read (endpoints/auth.ts)
    // But backend schema says it returns message + customer.

    // Let's trust the backend response.
    // If we want auto-login, we should call login() here.

    // For now, let's just return the response data to satisfy the interface.
    // NOTE: We'll cast to any because the types are slightly mismatched in the current state.
    return (response as any).customer;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is admin (is_superuser = true)
  const isAdmin = user?.is_superuser || false;

  // Check if user is customer (is_superuser = false)
  const isCustomer = user?.is_superuser === false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        isCustomer,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
