import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, Clock, TrendingUp } from 'lucide-react';
import { publicApi } from '@/api/endpoints/publicApi';

const HeroSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [popularSearches, setPopularSearches] = useState([]);
    const navigate = useNavigate();

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'products', label: 'Products' },
        { value: 'services', label: 'Services' },
        { value: 'businesses', label: 'Businesses' },
    ];

    // Fetch popular categories for popular searches
    useEffect(() => {
        const fetchPopularCategories = async () => {
            try {
                const data = await publicApi.getCategories();
                if (data && data.length > 0) {
                    // Take top 5 categories with highest count
                    const topCategories = data
                        .sort((a, b) => (b.count || 0) - (a.count || 0))
                        .slice(0, 5)
                        .map(cat => cat.name);
                    setPopularSearches(topCategories);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                // Fallback popular searches
                setPopularSearches([
                    'Industrial Machinery',
                    'IT Services',
                    'Building Materials',
                    'Medical Equipment',
                    'Food Processing',
                ]);
            }
        };

        fetchPopularCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${selectedCategory}`);
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>

                {/* Floating particles */}
                <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-40 right-32 w-3 h-3 bg-white/15 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-32 left-40 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDuration: '2.5s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                        <TrendingUp className="h-4 w-4 text-yellow-400" />
                        <span className="text-white/90 text-sm font-medium">India's #1 B2B Marketplace</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Verified</span> Businesses
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Discover thousands of trusted suppliers, manufacturers, and service providers
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
                        <div className="flex flex-col md:flex-row gap-2 bg-white/95 backdrop-blur p-2 rounded-2xl shadow-2xl shadow-blue-900/20">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="md:w-44 px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 font-medium"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search for products, services, or businesses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 border-0 focus:ring-0 text-gray-800 placeholder-gray-400 rounded-xl"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
                            >
                                <Search className="h-5 w-5" />
                                <span>Search</span>
                            </button>
                        </div>
                    </form>

                    {/* Popular Searches */}
                    {popularSearches.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-12">
                            <span className="text-blue-200 text-sm flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" /> Popular:
                            </span>
                            {popularSearches.map((term) => (
                                <button
                                    key={term}
                                    onClick={() => {
                                        setSearchQuery(term);
                                        navigate(`/search?q=${encodeURIComponent(term)}`);
                                    }}
                                    className="text-sm text-white/80 hover:text-white px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 transition-all hover:bg-white/10 backdrop-blur-sm"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 hover:bg-white/15 transition-all group">
                            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Shield className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">Verified Sellers</p>
                                <p className="text-blue-200 text-sm">100% Trusted</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 hover:bg-white/15 transition-all group">
                            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">Quick Response</p>
                                <p className="text-blue-200 text-sm">Within 24 Hours</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20 hover:bg-white/15 transition-all group">
                            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Clock className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-semibold">24/7 Support</p>
                                <p className="text-blue-200 text-sm">Always Available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSearch;
