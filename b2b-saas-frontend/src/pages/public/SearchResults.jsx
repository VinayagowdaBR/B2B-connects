import { useState, useEffect } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
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
    const { category: categorySlug } = useParams(); // Get category from URL param if present

    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    // Use URL param if available (converting slug to likely name or passing as is depending on backend), 
    // otherwise fallback to query param. 
    // Ideally backend should handle slug. For now let's pass it and assume backend handles partial name match or slug.
    const categoryParam = categorySlug ? categorySlug.replace(/-/g, ' ') : (searchParams.get('category') || '');

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

    // Update filters if URL param changes
    useEffect(() => {
        if (categorySlug) {
            // Try to find matching category from list (handles special chars like &)
            const foundCategory = categories.find(c => c.slug === categorySlug || c.slug === categorySlug.toLowerCase());
            const categoryName = foundCategory ? foundCategory.name : categorySlug.replace(/-/g, ' ');

            setFilters(prev => ({ ...prev, category: categoryName }));
        }
    }, [categorySlug, categories]);

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
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Gradient Hero Search Header */}
            <div className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-70" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    {/* Breadcrumb-ish or small label */}
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-4 animate-fade-in">
                        <span className="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            {filters.category || 'All Categories'}
                        </span>
                        {query && (
                            <>
                                <span className="text-gray-400">/</span>
                                <span className="bg-purple-50 px-3 py-1 rounded-full border border-purple-100 text-purple-600">
                                    "{query}"
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div className="animate-slide-up">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-3">
                                {filters.category ? (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                        Explore {filters.category}
                                    </span>
                                ) : query ? (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                        Results for "{query}"
                                    </span>
                                ) : (
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                        Discover Businesses
                                    </span>
                                )}
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                {loading ? 'Searching best matches...' : `Found ${total} verified listings matching your criteria`}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                                    title="Grid View"
                                >
                                    <Grid className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                                    title="List View"
                                >
                                    <List className="h-5 w-5" />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border font-medium transition-all shadow-sm ${showFilters || activeFiltersCount > 0
                                    ? 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                                        {activeFiltersCount}
                                    </span>
                                )}
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Panel - Enhanced */}
            <div className={`border-b border-gray-200 bg-white transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Refine Results</h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                            >
                                <X className="h-3 w-3" /> Clear filters
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                            <div className="relative">
                                <select
                                    value={type}
                                    onChange={(e) => setSearchParams({ q: query, type: e.target.value })}
                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-gray-700 font-medium transition-all hover:bg-white"
                                >
                                    <option value="all">All Types</option>
                                    <option value="businesses">Businesses</option>
                                    <option value="products">Products</option>
                                    <option value="services">Services</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                            <div className="relative">
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-gray-700 font-medium transition-all hover:bg-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id || cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                            <div className="relative">
                                <select
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-gray-700 font-medium transition-all hover:bg-white"
                                >
                                    <option value="">All Locations</option>
                                    {locations.cities?.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-end pb-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.verified}
                                        onChange={(e) => handleFilterChange('verified', e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">Verified Only</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[500px] transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {loading && results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Searching for the best matches...</h3>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">We couldn't find matches for your search. Try adjusting filters or using different keywords.</p>
                        <button onClick={clearFilters} className="mt-8 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors">
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                        : 'space-y-4'
                    }>
                        {results.map((item, index) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                to={item.type === 'business' ? `/business/${item.slug || item.tenant_id}` : `/${item.type}/${item.id}`}
                                className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-indigo-100 hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex items-center p-4' : 'flex flex-col'
                                    }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {viewMode === 'grid' && (
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        {/* Image / Placeholder */}
                                        {(item.image || item.logo) ? (
                                            <img
                                                src={item.image || item.logo}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
                                                {item.type === 'business' ? (
                                                    <Building2 className="w-12 h-12 text-indigo-300" />
                                                ) : item.type === 'product' ? (
                                                    <Package className="w-12 h-12 text-blue-300" />
                                                ) : (
                                                    <Briefcase className="w-12 h-12 text-green-300" />
                                                )}
                                            </div>
                                        )}

                                        {/* Type Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm backdrop-blur-md ${item.type === 'business' ? 'bg-white/90 text-indigo-700' :
                                                    item.type === 'product' ? 'bg-white/90 text-blue-700' :
                                                        'bg-white/90 text-green-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </div>

                                        {/* Verified Badge */}
                                        {item.is_verified && (
                                            <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full shadow-lg" title="Verified Business">
                                                <BadgeCheck className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={`flex-1 ${viewMode === 'list' ? 'ml-6' : 'p-6'}`}>
                                    {/* List View Image */}
                                    {viewMode === 'list' && (
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 mr-6">
                                            <img
                                                src={item.image || item.logo || 'https://via.placeholder.com/150'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        {/* Category */}
                                        <div className="text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wide">
                                            {item.category || item.type}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {item.name || item.title}
                                        </h3>

                                        {/* Rating/Location */}
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-semibold">{item.rating || 'New'}</span>
                                            </div>
                                            {item.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="truncate max-w-[150px]">{item.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description (Grid only) */}
                                        {viewMode === 'grid' && (
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                                {item.description || 'View details for more information about this listing.'}
                                            </p>
                                        )}

                                        {/* Price/Stats Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                            <div>
                                                {item.price ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-400 font-medium uppercase">Price</span>
                                                        <span className="text-lg font-bold text-gray-900">{item.price}</span>
                                                    </div>
                                                ) : item.products !== undefined ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-400 font-medium uppercase">Catalog</span>
                                                        <span className="text-sm font-semibold text-gray-900">{item.products} items</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-medium text-gray-500">Contact for Details</span>
                                                )}
                                            </div>

                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                <ChevronDown className="w-5 h-5 -rotate-90" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchResults;
