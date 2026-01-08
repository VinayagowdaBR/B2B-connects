import { useSubdomain } from '@/contexts/SubdomainContext';
import { Loader2 } from 'lucide-react';

/**
 * Renders business portfolio for subdomain URLs, otherwise renders children (main app).
 * This component should wrap the main Routes.
 */
const SubdomainRouter = ({ children, BusinessPortfolioComponent }) => {
    const { isSubdomain, companyData, loading, error } = useSubdomain();

    // Not on a subdomain - render normal app routes
    if (!isSubdomain) {
        return children;
    }

    // Loading company data for subdomain
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading company...</p>
                </div>
            </div>
        );
    }

    // Company not found for subdomain
    if (error || !companyData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
                <div className="text-center max-w-md px-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🏢</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        The company you're looking for doesn't exist or the subdomain is incorrect.
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Go to Main Site
                    </a>
                </div>
            </div>
        );
    }

    // Render the business portfolio with pre-loaded data
    return <BusinessPortfolioComponent preloadedData={companyData} isSubdomainView={true} />;
};

export default SubdomainRouter;
