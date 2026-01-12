import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2, MapPin, Star, BadgeCheck, Users, Package,
    Briefcase, Loader2, Search, Filter, ArrowRight,
    LayoutGrid, LayoutList, Sparkles, TrendingUp, Globe,
    ChevronDown, X
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const BusinessesPage = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState({ cities: [], states: [] });
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        verified: false
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [businessesData, categoriesData, locationsData] = await Promise.all([
                    publicApi.getBusinesses(0, 100),
                    publicApi.getCategories(),
                    publicApi.getLocations()
                ]);
                setBusinesses(businessesData || []);
                setCategories(categoriesData || []);
                setLocations(locationsData || { cities: [], states: [] });
            } catch (err) {
                console.error('Error fetching businesses:', err);
                // Fallback dummy data
                setBusinesses([
                    { id: 1, name: 'TechFlow Solutions', slug: 'techflow', industry: 'Technology', location: 'Mumbai, Maharashtra', rating: 4.8, reviews: 156, is_verified: true, products: 45, services: 12, logo: null, description: 'Leading provider of enterprise software solutions and digital transformation services.' },
                    { id: 2, name: 'GreenHarvest Agro', slug: 'greenharvest', industry: 'Agriculture', location: 'Pune, Maharashtra', rating: 4.6, reviews: 89, is_verified: true, products: 120, services: 8, logo: null, description: 'Organic farming products and sustainable agricultural solutions for modern farmers.' },
                    { id: 3, name: 'BuildRight Construction', slug: 'buildright', industry: 'Construction', location: 'Bangalore, Karnataka', rating: 4.5, reviews: 234, is_verified: false, products: 78, services: 15, logo: null, description: 'Quality construction materials and professional building services since 1995.' },
                    { id: 4, name: 'MediCare Plus', slug: 'medicare-plus', industry: 'Healthcare', location: 'Delhi, NCR', rating: 4.9, reviews: 312, is_verified: true, products: 200, services: 25, logo: null, description: 'Comprehensive healthcare equipment and medical supplies for hospitals and clinics.' },
                    { id: 5, name: 'FashionHub India', slug: 'fashionhub', industry: 'Apparel', location: 'Jaipur, Rajasthan', rating: 4.3, reviews: 178, is_verified: true, products: 500, services: 5, logo: null, description: 'Traditional and contemporary fashion wear with pan-India delivery.' },
                    { id: 6, name: 'PowerGrid Electronics', slug: 'powergrid', industry: 'Electronics', location: 'Chennai, Tamil Nadu', rating: 4.7, reviews: 267, is_verified: true, products: 350, services: 20, logo: null, description: 'Industrial electronics and electrical components manufacturer.' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredBusinesses = businesses.filter(business => {
        const matchesSearch = business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filters.category || business.industry === filters.category || business.category === filters.category;
        const matchesLocation = !filters.location || business.location?.includes(filters.location);
        const matchesVerified = !filters.verified || business.is_verified;
        return matchesSearch && matchesCategory && matchesLocation && matchesVerified;
    });

    const activeFiltersCount = [filters.category, filters.location, filters.verified].filter(Boolean).length;

    const clearFilters = () => {
        setFilters({ category: '', location: '', verified: false });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Hero Header */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 opacity-70" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                            <Building2 className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-600 text-sm font-semibold">Verified Businesses</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
                                Explore Businesses
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Connect with verified businesses across industries. Find trusted suppliers, manufacturers, and service providers.
                        </p>
                    </motion.div>

                    {/* Search and Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto"
                    >
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search businesses, industries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-medium shadow-lg shadow-gray-100/50 transition-all hover:shadow-xl"
                            />
                        </div>

                        {/* Filters Toggle & View Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium transition-all shadow-sm ${showFilters || activeFiltersCount > 0
                                    ? 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${viewMode === 'grid'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${viewMode === 'list'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <LayoutList className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results Count */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-gray-500 mt-6"
                    >
                        Showing <span className="font-semibold text-gray-900">{filteredBusinesses.length}</span> businesses
                    </motion.p>
                </div>
            </div>

            {/* Filters Panel */}
            <div className={`border-b border-gray-200 bg-white transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Filter Businesses</h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                            >
                                <X className="h-3 w-3" /> Clear all
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Industry</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                                <option value="">All Industries</option>
                                {categories.map((cat) => (
                                    <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                            <select
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                                <option value="">All Locations</option>
                                {locations.cities?.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.verified}
                                        onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                                        className="peer sr-only"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Verified Only</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Businesses Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Loading businesses...</h3>
                    </div>
                ) : filteredBusinesses.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any businesses matching your criteria. Try adjusting your filters.
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); clearFilters(); }}
                            className="mt-8 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredBusinesses.map((business, index) => (
                            <motion.div key={business.id || index} variants={itemVariants}>
                                <Link
                                    to={`/business/${business.slug || business.tenant_id || business.id}`}
                                    className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Header with Logo */}
                                    <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10" />
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

                                        {/* Verified Badge */}
                                        {business.is_verified && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg" title="Verified Business">
                                                <BadgeCheck className="w-4 h-4" />
                                            </div>
                                        )}

                                        {/* Logo */}
                                        <div className="absolute -bottom-8 left-6">
                                            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white">
                                                {business.logo ? (
                                                    <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-indigo-600" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-12">
                                        {/* Industry Tag */}
                                        <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg mb-3">
                                            {business.industry || business.category || 'Business'}
                                        </span>

                                        {/* Business Name */}
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                                            {business.name}
                                        </h3>

                                        {/* Location */}
                                        {business.location && (
                                            <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                                                <MapPin className="w-4 h-4" />
                                                {business.location}
                                            </p>
                                        )}

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-semibold text-gray-900">{business.rating || 'New'}</span>
                                            </div>
                                            {business.reviews && (
                                                <span className="text-sm text-gray-400">({business.reviews} reviews)</span>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {business.description || 'View this business profile for more details.'}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                            {business.products !== undefined && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Package className="w-4 h-4" />
                                                    <span>{business.products} Products</span>
                                                </div>
                                            )}
                                            {business.services !== undefined && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <Briefcase className="w-4 h-4" />
                                                    <span>{business.services} Services</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* List View */
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {filteredBusinesses.map((business, index) => (
                            <motion.div key={business.id || index} variants={itemVariants}>
                                <Link
                                    to={`/business/${business.slug || business.tenant_id || business.id}`}
                                    className="group flex items-center bg-white rounded-2xl p-4 md:p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Logo */}
                                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-4 md:mr-6">
                                        {business.logo ? (
                                            <img src={business.logo} alt={business.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <Building2 className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                                {business.name}
                                            </h3>
                                            {business.is_verified && (
                                                <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">
                                                {business.industry || business.category || 'Business'}
                                            </span>
                                            {business.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {business.location}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-1 hidden md:block">
                                            {business.description || 'View this business profile for more details.'}
                                        </p>
                                    </div>

                                    {/* Stats & Arrow */}
                                    <div className="flex items-center gap-6 ml-4">
                                        <div className="hidden sm:flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-semibold text-gray-900">{business.rating || 'New'}</span>
                                        </div>
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-xs text-gray-400 font-medium uppercase">Products</span>
                                            <span className="text-lg font-bold text-gray-900">{business.products || 0}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-indigo-600 flex items-center justify-center transition-all">
                                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            List Your Business Today
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Join thousands of verified businesses and reach new customers across India.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Register Your Business
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/categories"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <Globe className="w-5 h-5" />
                                Browse Categories
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BusinessesPage;
