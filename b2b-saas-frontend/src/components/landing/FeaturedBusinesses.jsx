import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, ArrowRight, Building2 } from 'lucide-react';

const FeaturedBusinesses = () => {
    // Demo data - will be replaced with API data
    const businesses = [
        {
            id: 1,
            slug: 'tech-solutions-pvt-ltd',
            name: 'Tech Solutions Pvt Ltd',
            logo: null,
            category: 'IT Services',
            location: 'Bangalore, Karnataka',
            rating: 4.8,
            reviews: 156,
            isVerified: true,
            products: 45,
            description: 'Leading provider of enterprise software solutions and IT consulting services.'
        },
        {
            id: 2,
            slug: 'steel-industries',
            name: 'Steel Industries',
            logo: null,
            category: 'Manufacturing',
            location: 'Mumbai, Maharashtra',
            rating: 4.6,
            reviews: 89,
            isVerified: true,
            products: 120,
            description: 'Premium quality steel products for construction and industrial applications.'
        },
        {
            id: 3,
            slug: 'agro-fresh-foods',
            name: 'Agro Fresh Foods',
            logo: null,
            category: 'Food & Agriculture',
            location: 'Pune, Maharashtra',
            rating: 4.9,
            reviews: 234,
            isVerified: true,
            products: 78,
            description: 'Organic food products and agricultural supplies for wholesale buyers.'
        },
        {
            id: 4,
            slug: 'medical-equipments-co',
            name: 'Medical Equipments Co',
            logo: null,
            category: 'Healthcare',
            location: 'Chennai, Tamil Nadu',
            rating: 4.7,
            reviews: 112,
            isVerified: true,
            products: 65,
            description: 'High-quality medical devices and hospital equipment supplier.'
        },
        {
            id: 5,
            slug: 'fashion-textile-hub',
            name: 'Fashion Textile Hub',
            logo: null,
            category: 'Apparel',
            location: 'Delhi, NCR',
            rating: 4.5,
            reviews: 198,
            isVerified: false,
            products: 250,
            description: 'Wholesale textiles and fashion garments for retail businesses.'
        },
        {
            id: 6,
            slug: 'buildright-materials',
            name: 'BuildRight Materials',
            logo: null,
            category: 'Construction',
            location: 'Hyderabad, Telangana',
            rating: 4.8,
            reviews: 145,
            isVerified: true,
            products: 90,
            description: 'Complete range of building and construction materials.'
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Featured Businesses
                        </h2>
                        <p className="text-gray-600">
                            Connect with verified and trusted suppliers
                        </p>
                    </div>
                    <Link
                        to="/search?type=businesses"
                        className="mt-4 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View All Businesses
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.map((business) => (
                        <Link
                            key={business.id}
                            to={`/business/${business.slug}`}
                            className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    {/* Logo */}
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
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
                                            {business.isVerified && (
                                                <BadgeCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-sm text-blue-600 font-medium">{business.category}</p>
                                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span className="truncate">{business.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    {business.description}
                                </p>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="font-medium text-gray-900">{business.rating}</span>
                                        <span className="text-gray-500 text-sm">({business.reviews} reviews)</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{business.products} Products</span>
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
