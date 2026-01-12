import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2, Cpu, Stethoscope, Wheat, Shirt, Package,
    Truck, Factory, Wrench, FlaskConical, Utensils, Gem,
    Loader2, Grid3X3, ArrowRight, Sparkles, TrendingUp,
    Search, Filter, LayoutGrid, LayoutList
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const iconMap = {
    Building2, Cpu, Stethoscope, Wheat, Shirt, Package,
    Truck, Factory, Wrench, FlaskConical, Utensils, Gem, Grid3X3
};

const colorVariants = {
    'bg-orange-500': { gradient: 'from-orange-500 to-orange-600', light: 'from-orange-50 to-orange-100', text: 'text-orange-600', shadow: 'shadow-orange-500/30', border: 'border-orange-200' },
    'bg-blue-500': { gradient: 'from-blue-500 to-blue-600', light: 'from-blue-50 to-blue-100', text: 'text-blue-600', shadow: 'shadow-blue-500/30', border: 'border-blue-200' },
    'bg-green-500': { gradient: 'from-green-500 to-emerald-600', light: 'from-green-50 to-emerald-100', text: 'text-green-600', shadow: 'shadow-green-500/30', border: 'border-green-200' },
    'bg-yellow-500': { gradient: 'from-yellow-500 to-amber-600', light: 'from-yellow-50 to-amber-100', text: 'text-yellow-600', shadow: 'shadow-yellow-500/30', border: 'border-yellow-200' },
    'bg-pink-500': { gradient: 'from-pink-500 to-rose-600', light: 'from-pink-50 to-rose-100', text: 'text-pink-600', shadow: 'shadow-pink-500/30', border: 'border-pink-200' },
    'bg-purple-500': { gradient: 'from-purple-500 to-violet-600', light: 'from-purple-50 to-violet-100', text: 'text-purple-600', shadow: 'shadow-purple-500/30', border: 'border-purple-200' },
    'bg-gray-600': { gradient: 'from-gray-600 to-gray-700', light: 'from-gray-50 to-gray-100', text: 'text-gray-600', shadow: 'shadow-gray-500/30', border: 'border-gray-200' },
    'bg-indigo-500': { gradient: 'from-indigo-500 to-indigo-600', light: 'from-indigo-50 to-indigo-100', text: 'text-indigo-600', shadow: 'shadow-indigo-500/30', border: 'border-indigo-200' },
    'bg-red-500': { gradient: 'from-red-500 to-red-600', light: 'from-red-50 to-red-100', text: 'text-red-600', shadow: 'shadow-red-500/30', border: 'border-red-200' },
    'bg-teal-500': { gradient: 'from-teal-500 to-teal-600', light: 'from-teal-50 to-teal-100', text: 'text-teal-600', shadow: 'shadow-teal-500/30', border: 'border-teal-200' },
    'bg-cyan-500': { gradient: 'from-cyan-500 to-cyan-600', light: 'from-cyan-50 to-cyan-100', text: 'text-cyan-600', shadow: 'shadow-cyan-500/30', border: 'border-cyan-200' },
    'bg-emerald-500': { gradient: 'from-emerald-500 to-emerald-600', light: 'from-emerald-50 to-emerald-100', text: 'text-emerald-600', shadow: 'shadow-emerald-500/30', border: 'border-emerald-200' },
};

const defaultCategories = [
    { name: 'Building & Construction', slug: 'building-construction', icon: 'Building2', color: 'bg-orange-500', count: 5420, description: 'Construction materials, equipment, and services' },
    { name: 'Electronics & Electrical', slug: 'electronics-electrical', icon: 'Cpu', color: 'bg-blue-500', count: 8930, description: 'Electronic components, devices, and systems' },
    { name: 'Healthcare & Medical', slug: 'healthcare-medical', icon: 'Stethoscope', color: 'bg-green-500', count: 3210, description: 'Medical supplies, equipment, and healthcare services' },
    { name: 'Food & Agriculture', slug: 'food-agriculture', icon: 'Wheat', color: 'bg-yellow-500', count: 6780, description: 'Agricultural products, food processing, and farming' },
    { name: 'Apparel & Garments', slug: 'apparel-garments', icon: 'Shirt', color: 'bg-pink-500', count: 4560, description: 'Clothing, textiles, and fashion accessories' },
    { name: 'Packaging & Supplies', slug: 'packaging-supplies', icon: 'Package', color: 'bg-purple-500', count: 2340, description: 'Packaging materials and supply solutions' },
    { name: 'Industrial Machinery', slug: 'industrial-machinery', icon: 'Factory', color: 'bg-gray-600', count: 7890, description: 'Manufacturing equipment and industrial machines' },
    { name: 'Transportation', slug: 'transportation-logistics', icon: 'Truck', color: 'bg-indigo-500', count: 1920, description: 'Logistics, shipping, and transportation services' },
    { name: 'Tools & Hardware', slug: 'tools-hardware', icon: 'Wrench', color: 'bg-red-500', count: 3450, description: 'Industrial tools and hardware supplies' },
    { name: 'Chemicals & Pharma', slug: 'chemicals-pharma', icon: 'FlaskConical', color: 'bg-teal-500', count: 2890, description: 'Chemical products and pharmaceutical supplies' },
    { name: 'Food Services', slug: 'food-services', icon: 'Utensils', color: 'bg-cyan-500', count: 1560, description: 'Restaurant equipment and food service supplies' },
    { name: 'Jewelry & Accessories', slug: 'jewelry-accessories', icon: 'Gem', color: 'bg-emerald-500', count: 980, description: 'Jewelry, gems, and fashion accessories' },
];

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getCategories();
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    setCategories(defaultCategories);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories(defaultCategories);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const formatCount = (count) => {
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
        return `${count}+`;
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Hero Header */}
            <div className="relative pt-40 pb-16 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-70" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-pink-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-600 text-sm font-semibold">Explore Industries</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                                All Categories
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover thousands of products and services across various industries. Find the perfect match for your business needs.
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
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-medium shadow-lg shadow-gray-100/50 transition-all hover:shadow-xl"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${viewMode === 'grid'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Grid</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${viewMode === 'list'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <LayoutList className="w-4 h-4" />
                                <span className="hidden sm:inline">List</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Results Count */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center text-gray-500 mt-6"
                    >
                        Showing <span className="font-semibold text-gray-900">{filteredCategories.length}</span> categories
                    </motion.p>
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Loading categories...</h3>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any categories matching "{searchQuery}". Try a different search term.
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-8 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
                        >
                            Clear search
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredCategories.map((category, index) => {
                            const IconComponent = iconMap[category.icon] || Grid3X3;
                            const colors = colorVariants[category.color] || colorVariants['bg-blue-500'];

                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        to={`/category/${category.slug}`}
                                        className="group relative block bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent transition-all duration-300 overflow-hidden h-full"
                                        style={{
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        {/* Gradient Background on Hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                        {/* Subtle light effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Icon */}
                                            <motion.div
                                                whileHover={{ rotate: 360, scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                                className={`inline-flex p-4 bg-gradient-to-br ${colors.light} rounded-2xl group-hover:bg-white/20 transition-colors shadow-sm mb-4`}
                                            >
                                                <IconComponent className={`w-8 h-8 ${colors.text} group-hover:text-white transition-colors`} />
                                            </motion.div>

                                            {/* Category Name */}
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors">
                                                {category.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors mb-4 line-clamp-2">
                                                {category.description || 'Explore products and services in this category'}
                                            </p>

                                            {/* Count with icon */}
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    {formatCount(category.count || 0)} listings
                                                </p>
                                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
                                            </div>
                                        </div>

                                        {/* Decorative Circle */}
                                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* List View */
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {filteredCategories.map((category, index) => {
                            const IconComponent = iconMap[category.icon] || Grid3X3;
                            const colors = colorVariants[category.color] || colorVariants['bg-blue-500'];

                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ x: 8 }}
                                >
                                    <Link
                                        to={`/category/${category.slug}`}
                                        className="group flex items-center bg-white rounded-2xl p-4 md:p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 inline-flex p-3 md:p-4 bg-gradient-to-br ${colors.light} rounded-xl mr-4 md:mr-6`}>
                                            <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${colors.text}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {category.description || 'Explore products and services in this category'}
                                            </p>
                                        </div>

                                        {/* Stats & Arrow */}
                                        <div className="flex items-center gap-4 md:gap-8 ml-4">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-xs text-gray-400 font-medium uppercase">Listings</span>
                                                <span className="text-lg font-bold text-gray-900">{formatCount(category.count || 0)}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-indigo-600 flex items-center justify-center transition-all">
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Join our platform and connect with verified businesses across all industries.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/search"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <Search className="w-5 h-5" />
                                Search All Listings
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CategoriesPage;
