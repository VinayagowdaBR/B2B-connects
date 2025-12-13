import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, ArrowRight, Building2, Loader2, Package, Briefcase, Award } from 'lucide-react';
import { publicApi } from '@/api/endpoints/publicApi';

const FeaturedBusinesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Demo data as fallback when database is empty
    const demoBusinesses = [
        {
            id: 1,
            tenant_id: 1,
            slug: 'tech-solutions-pvt-ltd',
            name: 'Tech Solutions Pvt Ltd',
            logo: null,
            category: 'IT Services',
            location: 'Bangalore, Karnataka',
            rating: 4.8,
            reviews: 156,
            is_verified: true,
            products: 45,
            services: 12,
            description: 'Leading provider of enterprise software solutions and IT consulting services.'
        },
        {
            id: 2,
            tenant_id: 2,
            slug: 'steel-industries',
            name: 'Steel Industries',
            logo: null,
            category: 'Manufacturing',
            location: 'Mumbai, Maharashtra',
            rating: 4.6,
            reviews: 89,
            is_verified: true,
            products: 120,
            services: 5,
            description: 'Premium quality steel products for construction and industrial applications.'
        },
        {
            id: 3,
            tenant_id: 3,
            slug: 'agro-fresh-foods',
            name: 'Agro Fresh Foods',
            logo: null,
            category: 'Food & Agriculture',
            location: 'Pune, Maharashtra',
            rating: 4.9,
            reviews: 234,
            is_verified: true,
            products: 78,
            services: 3,
            description: 'Organic food products and agricultural supplies for wholesale buyers.'
        },
        {
            id: 4,
            tenant_id: 4,
            slug: 'medical-equipments-co',
            name: 'Medical Equipments Co',
            logo: null,
            category: 'Healthcare',
            location: 'Chennai, Tamil Nadu',
            rating: 4.7,
            reviews: 112,
            is_verified: true,
            products: 65,
            services: 8,
            description: 'High-quality medical devices and hospital equipment supplier.'
        },
        {
            id: 5,
            tenant_id: 5,
            slug: 'fashion-textile-hub',
            name: 'Fashion Textile Hub',
            logo: null,
            category: 'Apparel',
            location: 'Delhi, NCR',
            rating: 4.5,
            reviews: 198,
            is_verified: false,
            products: 250,
            services: 2,
            description: 'Wholesale textiles and fashion garments for retail businesses.'
        },
        {
            id: 6,
            tenant_id: 6,
            slug: 'buildright-materials',
            name: 'BuildRight Materials',
            logo: null,
            category: 'Construction',
            location: 'Hyderabad, Telangana',
            rating: 4.8,
            reviews: 145,
            is_verified: true,
            products: 90,
            services: 6,
            description: 'Complete range of building and construction materials.'
        },
    ];

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getBusinesses(0, 6);
                // Use API data if available, otherwise use demo data
                if (data && data.length > 0) {
                    setBusinesses(data);
                } else {
                    setBusinesses(demoBusinesses);
                }
            } catch (err) {
                console.error('Error fetching businesses:', err);
                // Fallback to demo data on error
                setBusinesses(demoBusinesses);
                setError(null); // Don't show error to user, just use fallback
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading businesses...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Award className="h-4 w-4" />
                            Top Rated
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Featured Businesses
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Connect with verified and trusted suppliers across India
                        </p>
                    </div>
                    <Link
                        to="/search?type=businesses"
                        className="mt-6 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                    >
                        View All Businesses
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business, index) => (
                        <Link
                            key={business.id}
                            to={`/business/${business.slug || business.tenant_id}`}
                            className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Header with gradient */}
                            <div className="h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Logo */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                                        {business.logo ? (
                                            <img src={business.logo} alt={business.name} className="w-12 h-12 object-contain" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-blue-500" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                {business.name}
                                            </h3>
                                            {business.is_verified && (
                                                <BadgeCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <span className="inline-block text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
                                            {business.category}
                                        </span>
                                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span className="truncate">{business.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                                    {business.description}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-1 text-sm">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-700 font-medium">{business.products || 0}</span>
                                        <span className="text-gray-500">Products</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-700 font-medium">{business.services || 0}</span>
                                        <span className="text-gray-500">Services</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(business.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-medium text-gray-900 ml-1">{business.rating || 4.5}</span>
                                        <span className="text-gray-500 text-sm">({business.reviews || 0})</span>
                                    </div>
                                    <span className="text-sm text-blue-600 font-medium group-hover:underline flex items-center gap-1">
                                        View Profile <ArrowRight className="h-3 w-3" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedBusinesses;
