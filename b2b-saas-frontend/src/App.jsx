import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import SubscriptionManagement from '@/pages/admin/SubscriptionManagement';
import CompanyServicesManagement from '@/pages/admin/CompanyServicesManagement';
import CompanyProductsManagement from '@/pages/admin/CompanyProductsManagement';
import CompanyProjectsManagement from '@/pages/admin/CompanyProjectsManagement';
import CompanyTestimonialsManagement from '@/pages/admin/CompanyTestimonialsManagement';
import CompanyBlogPostsManagement from '@/pages/admin/CompanyBlogPostsManagement';
import CompanyTeamMembersManagement from '@/pages/admin/CompanyTeamMembersManagement';
import CompanyCareersManagement from '@/pages/admin/CompanyCareersManagement';
import CompanyInquiriesManagement from '@/pages/admin/CompanyInquiriesManagement';
import CompanyGalleryManagement from '@/pages/admin/CompanyGalleryManagement';



// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import RolesPermissions from '@/pages/admin/RolesPermissions';
import LocationsManagement from '@/pages/admin/LocationsManagement';
import CustomerTypesManagement from '@/pages/admin/CustomerTypesManagement';
import CustomersManagement from '@/pages/admin/CustomersManagement';
import CompanyInfoManagement from '@/pages/admin/CompanyInfoManagement';


// Customer Pages
import CustomerDashboard from '@/pages/customer/CustomerDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RolesPermissions />
              </ProtectedRoute>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Subscription Routes */}
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SubscriptionManagement />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/locations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LocationsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyInfoManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyServicesManagement />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyProductsManagement />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyProjectsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyTestimonialsManagement />
              </ProtectedRoute>
            }
          />


          {/* Blog Posts Route */}
          <Route
            path="/admin/blog-posts"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyBlogPostsManagement />
              </ProtectedRoute>
            }
          />

          {/* Team Members Route */}
          <Route
            path="/admin/team-members"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyTeamMembersManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/careers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyCareersManagement />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyInquiriesManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CompanyGalleryManagement />
              </ProtectedRoute>
            }
          />




          {/* Customer Management routes */}
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomersManagement />
              </ProtectedRoute>
            }
          />

          {/* customer Type routes */}
          <Route
            path="/admin/customer-types"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CustomerTypesManagement />
              </ProtectedRoute>
            }
          />


          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
