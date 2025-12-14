import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ScrollToTop from '@/components/common/ScrollToTop';

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Lazy load pages for better performance
// Public Pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const BusinessPortfolio = lazy(() => import('@/pages/public/BusinessPortfolio'));
const SearchResults = lazy(() => import('@/pages/public/SearchResults'));
const ProductDetail = lazy(() => import('@/pages/public/ProductDetail'));
const ServiceDetail = lazy(() => import('@/pages/public/ServiceDetail'));

// Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));
const RolesPermissions = lazy(() => import('@/pages/admin/RolesPermissions'));
const LocationsManagement = lazy(() => import('@/pages/admin/LocationsManagement'));
const CustomerTypesManagement = lazy(() => import('@/pages/admin/CustomerTypesManagement'));
const CustomersManagement = lazy(() => import('@/pages/admin/CustomersManagement'));
const CompanyInfoManagement = lazy(() => import('@/pages/admin/CompanyInfoManagement'));
const CategoriesManagement = lazy(() => import('@/pages/admin/CategoriesManagement'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const SubscriptionManagement = lazy(() => import('@/pages/admin/SubscriptionManagement'));
const CompanyServicesManagement = lazy(() => import('@/pages/admin/CompanyServicesManagement'));
const CompanyProductsManagement = lazy(() => import('@/pages/admin/CompanyProductsManagement'));
const CompanyProjectsManagement = lazy(() => import('@/pages/admin/CompanyProjectsManagement'));
const CompanyTestimonialsManagement = lazy(() => import('@/pages/admin/CompanyTestimonialsManagement'));
const CompanyBlogPostsManagement = lazy(() => import('@/pages/admin/CompanyBlogPostsManagement'));
const CompanyTeamMembersManagement = lazy(() => import('@/pages/admin/CompanyTeamMembersManagement'));
const CompanyCareersManagement = lazy(() => import('@/pages/admin/CompanyCareersManagement'));
const CompanyInquiriesManagement = lazy(() => import('@/pages/admin/CompanyInquiriesManagement'));
const CompanyGalleryManagement = lazy(() => import('@/pages/admin/CompanyGalleryManagement'));

// Customer Pages
const CustomerDashboard = lazy(() => import('@/pages/customer/CustomerDashboard'));
const CustomerProfile = lazy(() => import('@/pages/customer/CustomerProfile'));
const CustomerSubscription = lazy(() => import('@/pages/customer/CustomerSubscription'));
const CustomerCompanyInfo = lazy(() => import('@/pages/customer/CustomerCompanyInfo'));
const CustomerServices = lazy(() => import('@/pages/customer/CustomerServices'));
const CustomerProducts = lazy(() => import('@/pages/customer/CustomerProducts'));
const CustomerProjects = lazy(() => import('@/pages/customer/CustomerProjects'));
const CustomerTestimonials = lazy(() => import('@/pages/customer/CustomerTestimonials'));
const CustomerTeamMembers = lazy(() => import('@/pages/customer/CustomerTeamMembers'));
const CustomerBlogPosts = lazy(() => import('@/pages/customer/CustomerBlogPosts'));
const CustomerCareers = lazy(() => import('@/pages/customer/CustomerCareers'));
const CustomerInquiries = lazy(() => import('@/pages/customer/CustomerInquiries'));
const CustomerGallery = lazy(() => import('@/pages/customer/CustomerGallery'));
const CustomerSettings = lazy(() => import('@/pages/customer/CustomerSettings'));
const DemoPaymentPage = lazy(() => import('@/pages/customer/DemoPaymentPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/business/:slug" element={<BusinessPortfolio />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/service/:id" element={<ServiceDetail />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={['admin']}><RolesPermissions /></ProtectedRoute>} />
            <Route path="/admin/locations" element={<ProtectedRoute allowedRoles={['admin']}><LocationsManagement /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute allowedRoles={['admin']}><CustomersManagement /></ProtectedRoute>} />
            <Route path="/admin/customer-types" element={<ProtectedRoute allowedRoles={['admin']}><CustomerTypesManagement /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><CompanyInfoManagement /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin']}><CategoriesManagement /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['admin']}><SubscriptionManagement /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute allowedRoles={['admin']}><CompanyServicesManagement /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><CompanyProductsManagement /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['admin']}><CompanyProjectsManagement /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute allowedRoles={['admin']}><CompanyTestimonialsManagement /></ProtectedRoute>} />
            <Route path="/admin/blog-posts" element={<ProtectedRoute allowedRoles={['admin']}><CompanyBlogPostsManagement /></ProtectedRoute>} />
            <Route path="/admin/team-members" element={<ProtectedRoute allowedRoles={['admin']}><CompanyTeamMembersManagement /></ProtectedRoute>} />
            <Route path="/admin/careers" element={<ProtectedRoute allowedRoles={['admin']}><CompanyCareersManagement /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute allowedRoles={['admin']}><CompanyInquiriesManagement /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute allowedRoles={['admin']}><CompanyGalleryManagement /></ProtectedRoute>} />

            {/* Customer Routes */}
            <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={['customer']}><CustomerProfile /></ProtectedRoute>} />
            <Route path="/customer/subscription" element={<ProtectedRoute allowedRoles={['customer']}><CustomerSubscription /></ProtectedRoute>} />
            <Route path="/customer/company-info" element={<ProtectedRoute allowedRoles={['customer']}><CustomerCompanyInfo /></ProtectedRoute>} />
            <Route path="/customer/services" element={<ProtectedRoute allowedRoles={['customer']}><CustomerServices /></ProtectedRoute>} />
            <Route path="/customer/products" element={<ProtectedRoute allowedRoles={['customer']}><CustomerProducts /></ProtectedRoute>} />
            <Route path="/customer/projects" element={<ProtectedRoute allowedRoles={['customer']}><CustomerProjects /></ProtectedRoute>} />
            <Route path="/customer/testimonials" element={<ProtectedRoute allowedRoles={['customer']}><CustomerTestimonials /></ProtectedRoute>} />
            <Route path="/customer/team-members" element={<ProtectedRoute allowedRoles={['customer']}><CustomerTeamMembers /></ProtectedRoute>} />
            <Route path="/customer/blog-posts" element={<ProtectedRoute allowedRoles={['customer']}><CustomerBlogPosts /></ProtectedRoute>} />
            <Route path="/customer/careers" element={<ProtectedRoute allowedRoles={['customer']}><CustomerCareers /></ProtectedRoute>} />
            <Route path="/customer/inquiries" element={<ProtectedRoute allowedRoles={['customer']}><CustomerInquiries /></ProtectedRoute>} />
            <Route path="/customer/gallery" element={<ProtectedRoute allowedRoles={['customer']}><CustomerGallery /></ProtectedRoute>} />
            <Route path="/customer/settings" element={<ProtectedRoute allowedRoles={['customer']}><CustomerSettings /></ProtectedRoute>} />
            <Route path="/subscription/demo-payment" element={<DemoPaymentPage />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>

      {/* Premium Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'backdrop-blur-xl',
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
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
