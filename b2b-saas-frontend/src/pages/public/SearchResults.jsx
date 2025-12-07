import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Search,
    Filter,
    MapPin,
    Star,
    BadgeCheck,
    Building2,
    Package,
    Grid,
    List,
    ChevronDown,
    X,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        location: '',
        verified: false,
    });

    // Demo search results
    const results = [
        {
            id: 1,
            type: 'business',
            slug: 'tech-solutions-pvt-ltd',
            name: 'Tech Solutions Pvt Ltd',
            category: 'IT Services',
            location: 'Bangalore, Karnataka',
            rating: 4.8,
            reviews: 156,
            isVerified: true,
            products: 45,
            description: 'Leading provider of enterprise software solutions and IT consulting services.',
        },
        {
            id: 2,
            type: 'product',
            name: 'Industrial CNC Machine',
            price: '₹5,50,000',
            priceUnit: 'per unit',
            business: 'Tech Machinery Ltd',
            location: 'Mumbai',
            rating: 4.7,
        },
        {
            id: 3,
            type: 'business',
            slug: 'steel-industries',
            name: 'Steel Industries',
            category: 'Manufacturing',
            location: 'Mumbai, Maharashtra',
            rating: 4.6,
            reviews: 89,
            isVerified: true,
            products: 120,
            description: 'Premium quality steel products for construction and industrial applications.',
        },
        {
            id: 4,
            type: 'product',
            name: 'Stainless Steel Pipes',
            price: '₹450',
            priceUnit: 'per kg',
            business: 'Steel Industries',
            location: 'Pune',
            rating: 4.5,
        },
        {
            id: 5,
            type: 'business',
            slug: 'agro-fresh-foods',
            name: 'Agro Fresh Foods',
            category: 'Food & Agriculture',
            location: 'Pune, Maharashtra',
            rating: 4.9,
            reviews: 234,
            isVerified: true,
            products: 78,
            description: 'Organic food products and agricultural supplies for wholesale buyers.',
        },
        {
            id: 6,
            type: 'product',
            name: 'Organic Rice (Bulk)',
            price: '₹65',
            priceUnit: 'per kg',
            business: 'Agro Fresh Foods',
            location: 'Chennai',
            rating: 4.8,
        },
    ];

    const categories = [
        'All Categories',
        'IT Services',
        'Manufacturing',
        'Food & Agriculture',
        'Healthcare',
        'Construction',
    ];

    const locations = [
        'All Locations',
        'Bangalore',
        'Mumbai',
        'Delhi',
        'Chennai',
        'Pune',
        'Hyderabad',
    ];

    const filteredResults = results.filter((item) => {
        if (type !== 'all' && item.type !== type.slice(0, -1)) return false;
        if (filters.category && item.category !== filters.category) return false;
        if (filters.location && !item.location.includes(filters.location)) return false;
        if (filters.verified && !item.isVerified) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Search Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Search Results for "{query}"
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {filteredResults.length} results found
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setSearchParams({ q: query, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="businesses">Businesses</option>
                                        <option value="products">Products</option>
                                        <option value="services">Services</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <select
                                        value={filters.location}
                                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc === 'All Locations' ? '' : loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.verified}
                                            onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Verified Only</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredResults.length === 0 ? (
                    <div className="text-center py-16">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                        {filteredResults.map((item) => (
                            item.type === 'business' ? (
                                <Link
                                    key={`business-${item.id}`}
                                    to={`/business/${item.slug}`}
                                    className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-center p-4' : 'p-5'
                                        }`}
                                >
                                    <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
                                        <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-14 h-14'} bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <Building2 className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <div className={viewMode === 'list' ? 'flex-1' : 'mt-4'}>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                                {item.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                                            </div>
                                            <p className="text-sm text-blue-600">{item.category}</p>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{item.location}</span>
                                            </div>
                                            {viewMode === 'grid' && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-medium">{item.rating}</span>
                                                    <span className="text-sm text-gray-500">({item.reviews})</span>
                                                </div>
                                                <span className="text-sm text-gray-500">{item.products} Products</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div
                                    key={`product-${item.id}`}
                                    className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-center p-4' : ''
                                        }`}
                                >
                                    {viewMode === 'grid' && (
                                        <div className="aspect-square bg-gray-100 rounded-t-xl flex items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}
                                    <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : 'p-4'}>
                                        {viewMode === 'list' && (
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package className="w-8 h-8 text-gray-300" />
                                            </div>
                                        )}
                                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-lg font-bold text-gray-900">{item.price}</span>
                                                <span className="text-xs text-gray-500">{item.priceUnit}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{item.business}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{item.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                    <span className="text-xs font-medium">{item.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchResults;
