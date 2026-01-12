import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Package, MapPin, Star, BadgeCheck, Building2,
    Loader2, Search, Filter, ArrowRight, ShoppingBag,
    LayoutGrid, LayoutList, Sparkles, Tag,
    ChevronDown, X, Heart, Eye
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        verified: false
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    publicApi.getProducts(0, 100),
                    publicApi.getCategories()
                ]);
                setProducts(productsData || []);
                setCategories(categoriesData || []);
            } catch (err) {
                console.error('Error fetching products:', err);
                // Fallback dummy data
                setProducts([
                    { id: 1, name: 'Industrial Steel Pipes', slug: 'industrial-steel-pipes', category: 'Building & Construction', price: '₹2,500/unit', business_name: 'BuildRight Construction', business_slug: 'buildright', location: 'Mumbai', rating: 4.8, reviews: 124, is_verified: true, image: null, description: 'High-quality galvanized steel pipes for industrial and construction use.' },
                    { id: 2, name: 'Organic Fertilizer Pack', slug: 'organic-fertilizer', category: 'Food & Agriculture', price: '₹850/bag', business_name: 'GreenHarvest Agro', business_slug: 'greenharvest', location: 'Pune', rating: 4.6, reviews: 89, is_verified: true, image: null, description: 'Natural organic fertilizer for better crop yield and soil health.' },
                    { id: 3, name: 'LED Industrial Light 100W', slug: 'led-industrial-light', category: 'Electronics & Electrical', price: '₹1,200/piece', business_name: 'PowerGrid Electronics', business_slug: 'powergrid', location: 'Chennai', rating: 4.7, reviews: 156, is_verified: true, image: null, description: 'Energy-efficient LED lighting for warehouses and factories.' },
                    { id: 4, name: 'Medical Surgical Gloves', slug: 'surgical-gloves', category: 'Healthcare & Medical', price: '₹450/box', business_name: 'MediCare Plus', business_slug: 'medicare-plus', location: 'Delhi', rating: 4.9, reviews: 234, is_verified: true, image: null, description: 'Latex-free surgical gloves for medical professionals.' },
                    { id: 5, name: 'Cotton Fabric Roll', slug: 'cotton-fabric-roll', category: 'Apparel & Garments', price: '₹180/meter', business_name: 'FashionHub India', business_slug: 'fashionhub', location: 'Jaipur', rating: 4.5, reviews: 178, is_verified: true, image: null, description: 'Premium quality cotton fabric for garment manufacturing.' },
                    { id: 6, name: 'Packaging Carton Box', slug: 'carton-box', category: 'Packaging & Supplies', price: '₹25/piece', business_name: 'PackMaster Industries', business_slug: 'packmaster', location: 'Bangalore', rating: 4.4, reviews: 98, is_verified: false, image: null, description: 'Corrugated carton boxes for safe product packaging.' },
                    { id: 7, name: 'CNC Machine Tool', slug: 'cnc-machine-tool', category: 'Industrial Machinery', price: '₹85,000/unit', business_name: 'TechMach Industries', business_slug: 'techmach', location: 'Ahmedabad', rating: 4.8, reviews: 67, is_verified: true, image: null, description: 'Precision CNC machine tools for manufacturing industry.' },
                    { id: 8, name: 'Safety Helmet', slug: 'safety-helmet', category: 'Tools & Hardware', price: '₹350/piece', business_name: 'SafetyFirst Pro', business_slug: 'safetyfirst', location: 'Hyderabad', rating: 4.6, reviews: 145, is_verified: true, image: null, description: 'Industrial safety helmets meeting IS standards.' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.business_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filters.category || product.category === filters.category;
        const matchesVerified = !filters.verified || product.is_verified;
        return matchesSearch && matchesCategory && matchesVerified;
    });

    const activeFiltersCount = [filters.category, filters.minPrice, filters.maxPrice, filters.verified].filter(Boolean).length;

    const clearFilters = () => {
        setFilters({ category: '', minPrice: '', maxPrice: '', verified: false });
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

            {/* Hero Header - Matching Home Page Theme */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Gradients - Indigo/Purple theme like home page */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-70" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600 text-sm font-semibold">Fresh Arrivals</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                                Explore Products
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover quality products from verified suppliers. Compare prices and find the best deals for your business.
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
                                placeholder="Search products, categories, suppliers..."
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
                        Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                    </motion.p>
                </div>
            </div>

            {/* Filters Panel */}
            <div className={`border-b border-gray-200 bg-white transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Filter Products</h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                            >
                                <X className="h-3 w-3" /> Clear all
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Price</label>
                            <input
                                type="number"
                                placeholder="₹ Min"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Max Price</label>
                            <input
                                type="number"
                                placeholder="₹ Max"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            />
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
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">Verified Sellers</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Loading products...</h3>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any products matching your criteria. Try adjusting your filters.
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
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredProducts.map((product, index) => (
                            <motion.div key={product.id || index} variants={itemVariants} whileHover={{ y: -12 }} className="group">
                                <Link
                                    to={`/product/${product.id}`}
                                    className="block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                        {product.image ? (
                                            <motion.img
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-20 h-20 text-gray-300" />
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-3 bg-white rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-3 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Heart className="w-5 h-5" />
                                            </motion.button>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-600 shadow-lg">
                                            {product.category || 'Product'}
                                        </div>

                                        {/* Verified Badge */}
                                        {product.is_verified && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white p-1.5 rounded-full shadow-lg" title="Verified Seller">
                                                <BadgeCheck className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <span className="text-2xl font-bold text-indigo-600">
                                                {product.price || 'Contact for price'}
                                            </span>
                                        </div>

                                        {/* Supplier Info */}
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <ShoppingBag className="w-4 h-4" />
                                            <span className="line-clamp-1">{product.business_name || 'Supplier'}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span>{product.location || 'India'}</span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {product.rating || 4.5}
                                            </span>
                                            {product.reviews && (
                                                <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500 ring-opacity-50 blur-sm" />
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
                        {filteredProducts.map((product, index) => (
                            <motion.div key={product.id || index} variants={itemVariants}>
                                <Link
                                    to={`/product/${product.id}`}
                                    className="group flex items-center bg-white rounded-2xl p-4 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Product Image */}
                                    <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mr-4 md:mr-6 overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-10 h-10 text-gray-300" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded">
                                                {product.category || 'Product'}
                                            </span>
                                            {product.is_verified && (
                                                <BadgeCheck className="w-4 h-4 text-green-500" />
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                            {product.name}
                                        </h3>
                                        <p className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                            <Building2 className="w-3.5 h-3.5" />
                                            {product.business_name || 'Supplier'}
                                            {product.location && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <MapPin className="w-3 h-3" />
                                                    {product.location}
                                                </>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600 line-clamp-1 hidden md:block">
                                            {product.description || 'View product details for more information.'}
                                        </p>
                                    </div>

                                    {/* Price & Arrow */}
                                    <div className="flex items-center gap-6 ml-4">
                                        <div className="hidden sm:flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-semibold text-gray-900">{product.rating || 'New'}</span>
                                        </div>
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="text-xs text-gray-400 font-medium uppercase">Price</span>
                                            <span className="text-lg font-bold text-indigo-600">{product.price || 'Contact'}</span>
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

            {/* CTA Section - Matching home page theme */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            List Your Products Today
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Reach thousands of buyers looking for quality products. Start selling on our platform.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Start Selling
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/categories"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <Tag className="w-5 h-5" />
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

export default ProductsPage;
