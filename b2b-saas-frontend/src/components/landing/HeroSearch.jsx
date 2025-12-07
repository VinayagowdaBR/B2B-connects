import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Shield, Clock, ArrowRight } from 'lucide-react';

const HeroSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const navigate = useNavigate();

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'products', label: 'Products' },
        { value: 'services', label: 'Services' },
        { value: 'businesses', label: 'Businesses' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${selectedCategory}`);
        }
    };

    const popularSearches = [
        'Industrial Machinery',
        'IT Services',
        'Building Materials',
        'Medical Equipment',
        'Food Processing',
    ];

    return (
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-float-reverse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="text-center">
                    {/* Headline */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
                        Connect with <span className="text-yellow-400">Verified</span> Businesses
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in">
                        India's largest B2B marketplace connecting buyers with trusted suppliers
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8 animate-slide-up">
                        <div className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-xl shadow-2xl">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="md:w-40 px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-4 py-3 border-0 focus:ring-0 text-gray-800 placeholder-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Search className="h-5 w-5" />
                                <span>Search</span>
                            </button>
                        </div>
                    </form>

                    {/* Popular Searches */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-in">
                        <span className="text-blue-200 text-sm">Popular:</span>
                        {popularSearches.map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                    navigate(`/search?q=${encodeURIComponent(term)}`);
                                }}
                                className="text-sm text-white/80 hover:text-white px-3 py-1 rounded-full border border-white/20 hover:border-white/40 transition-all hover:bg-white/10"
                            >
                                {term}
                            </button>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up">
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                            <Shield className="h-8 w-8 text-yellow-400" />
                            <div className="text-left">
                                <p className="text-white font-semibold">Verified Sellers</p>
                                <p className="text-blue-200 text-sm">100% Trusted</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                            <Zap className="h-8 w-8 text-yellow-400" />
                            <div className="text-left">
                                <p className="text-white font-semibold">Quick Response</p>
                                <p className="text-blue-200 text-sm">Within 24 Hours</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                            <Clock className="h-8 w-8 text-yellow-400" />
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
