import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('admin' | 'customer')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles) {
        const { isAdmin, isCustomer } = useAuth();

        const hasRequiredRole = allowedRoles.some(role => {
            if (role === 'admin') return isAdmin;
            if (role === 'customer') return isCustomer;
            return false;
        });

        if (!hasRequiredRole) {
            // Redirect to appropriate dashboard based on user's actual role
            if (isAdmin) {
                return <Navigate to="/admin/dashboard" replace />;
            } else {
                return <Navigate to="/customer/dashboard" replace />;
            }
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
