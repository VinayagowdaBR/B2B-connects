import { createContext, useContext, useState, useEffect } from 'react';
import { publicApi } from '@/api/endpoints/publicApi';

const SubdomainContext = createContext(null);

/**
 * Extracts subdomain from the current hostname.
 * Examples:
 *   - monkey-tech.b2bconnect.com → "monkey-tech"
 *   - test-company.localhost → "test-company"
 *   - b2bconnect.com → null (main domain)
 *   - localhost → null (local dev main)
 */
function extractSubdomain() {
    const hostname = window.location.hostname;

    // Skip if it's an IP address
    if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return null;
    }

    const parts = hostname.split('.');

    // Local development: test-company.localhost
    if (hostname.endsWith('.localhost') || hostname.endsWith('.localhost:5173')) {
        return parts.length >= 2 ? parts[0] : null;
    }

    // Production: company.b2bconnect.com (3+ parts)
    // Exclude www as a subdomain
    if (parts.length >= 3) {
        const subdomain = parts[0];
        if (subdomain.toLowerCase() !== 'www') {
            return subdomain;
        }
    }

    return null;
}

export function SubdomainProvider({ children }) {
    const [subdomain, setSubdomain] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const detected = extractSubdomain();
        setSubdomain(detected);

        if (detected) {
            // Fetch company data based on subdomain
            publicApi.getBusinessPortfolio(detected)
                .then(data => {
                    setCompanyData(data);
                    setError(null);
                })
                .catch(err => {
                    console.error('Failed to load company for subdomain:', detected, err);
                    setError('Company not found');
                    setCompanyData(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const value = {
        subdomain,           // e.g., "monkey-tech" or null
        isSubdomain: !!subdomain,  // true if on a company subdomain
        companyData,         // Full company portfolio data
        loading,             // Loading state for company data
        error,               // Error message if company not found
    };

    return (
        <SubdomainContext.Provider value={value}>
            {children}
        </SubdomainContext.Provider>
    );
}

export function useSubdomain() {
    const context = useContext(SubdomainContext);
    if (!context) {
        throw new Error('useSubdomain must be used within a SubdomainProvider');
    }
    return context;
}

export default SubdomainContext;
