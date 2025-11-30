import { createContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse } from '@/api/endpoints/auth';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (username: string, password: string) => Promise<AuthResponse['user']>;
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
