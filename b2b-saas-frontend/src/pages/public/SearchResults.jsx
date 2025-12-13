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
    Briefcase,
    Grid,
    List,
    ChevronDown,
    X,
    Loader2,
    SlidersHorizontal
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const categoryParam = searchParams.get('category') || '';

    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState({ cities: [], states: [] });

    const [filters, setFilters] = useState({
        category: categoryParam,
        location: '',
        verified: false,
    });

    // Fetch search results
    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await publicApi.search({
                    q: query,
                    type: type,
                    category: filters.category,
                    location: filters.location,
                    verified: filters.verified,
                    skip: 0,
                    limit: 50
                });
                setResults(data.results || []);
                setTotal(data.total || 0);
            } catch (err) {
                console.error('Error searching:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, type, filters]);

    // Fetch categories and locations for filters
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [categoriesData, locationsData] = await Promise.all([
                    publicApi.getCategories(),
                    publicApi.getLocations()
                ]);
                setCategories(categoriesData || []);
                setLocations(locationsData || { cities: [], states: [] });
            } catch (err) {
                console.error('Error fetching filter data:', err);
            }
        };

        fetchFilterData();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ category: '', location: '', verified: false });
    };

    const activeFiltersCount = [
        filters.category,
        filters.location,
        filters.verified
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Search Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {query ? `Search Results for "${query}"` : 'Browse All'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {loading ? 'Searching...' : `${total} results found`}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${showFilters || activeFiltersCount > 0
                                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-gray-900">Filters</h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                    >
                                        <X className="h-3 w-3" /> Clear all
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setSearchParams({ q: query, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id || cat.name} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <select
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.cities?.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.verified}
                                            onChange={(e) => handleFilterChange('verified', e.target.checked)}
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
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Searching...</span>
                    </div>
                ) : results.length === 0 ? (
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
                        {results.map((item) => (
                            item.type === 'business' ? (
                                <Link
                                    key={`business-${item.id}`}
                                    to={`/business/${item.slug || item.tenant_id}`}
                                    className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group ${viewMode === 'list' ? 'flex items-center p-4' : 'p-5'
                                        }`}
                                >
                                    <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
                                        <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-14 h-14'} bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                                            {item.logo ? (
                                                <img src={item.logo} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-8 h-8 text-blue-500" />
                                            )}
                                        </div>
                                        <div className={viewMode === 'list' ? 'flex-1' : 'mt-4'}>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                                {item.is_verified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                                            </div>
                                            <p className="text-sm text-blue-600">{item.category}</p>
                                            {item.location && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{item.location}</span>
                                                </div>
                                            )}
                                            {viewMode === 'grid' && item.description && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-medium">{item.rating}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">{item.products} Products</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : item.type === 'product' ? (
                                <Link
                                    key={`product-${item.id}`}
                                    to={`/product/${item.id}`}
                                    className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group ${viewMode === 'list' ? 'flex items-center p-4' : ''
                                        }`}
                                >
                                    {viewMode === 'grid' && (
                                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-xl flex items-center justify-center overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <Package className="w-12 h-12 text-gray-300" />
                                            )}
                                        </div>
                                    )}
                                    <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : 'p-4'}>
                                        {viewMode === 'list' && (
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                        )}
                                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                            <div className="flex items-baseline gap-1 mt-1">
                                                <span className="text-lg font-bold text-gray-900">{item.price}</span>
                                                <span className="text-xs text-gray-500">{item.price_unit}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{item.business}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                {item.location && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{item.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                    <span className="text-xs font-medium">{item.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <Link
                                    key={`service-${item.id}`}
                                    to={`/service/${item.id}`}
                                    className={`bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group ${viewMode === 'list' ? 'flex items-center p-4' : 'p-5'
                                        }`}
                                >
                                    <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
                                        <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-12 h-12'} bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <Briefcase className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className={viewMode === 'list' ? 'flex-1' : 'mt-4'}>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.business}</p>
                                            {item.pricing && (
                                                <p className="text-sm text-blue-600 font-medium mt-1">{item.pricing}</p>
                                            )}
                                            {item.location && (
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{item.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
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
