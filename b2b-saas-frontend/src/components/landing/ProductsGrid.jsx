import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, MapPin, Loader2, Package, Heart, Eye } from 'lucide-react';
import { publicApi } from '@/api/endpoints/publicApi';

const ProductsGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Demo data as fallback when database is empty
    const demoProducts = [
        { id: 1, name: 'Industrial CNC Machine', image: null, price: '₹5,50,000', price_unit: 'per unit', business: 'Tech Machinery Ltd', location: 'Mumbai', rating: 4.7, category: 'Machinery' },
        { id: 2, name: 'Stainless Steel Pipes', image: null, price: '₹450', price_unit: 'per kg', business: 'Steel Industries', location: 'Pune', rating: 4.5, category: 'Steel' },
        { id: 3, name: 'Organic Rice (Bulk)', image: null, price: '₹65', price_unit: 'per kg', business: 'Agro Fresh Foods', location: 'Chennai', rating: 4.8, category: 'Agriculture' },
        { id: 4, name: 'Digital Blood Pressure Monitor', image: null, price: '₹2,500', price_unit: 'per unit', business: 'Medical Equipments Co', location: 'Delhi', rating: 4.6, category: 'Medical' },
        { id: 5, name: 'Cotton Fabric Roll', image: null, price: '₹180', price_unit: 'per meter', business: 'Fashion Textile Hub', location: 'Bangalore', rating: 4.4, category: 'Textile' },
        { id: 6, name: 'Cement (OPC 53 Grade)', image: null, price: '₹380', price_unit: 'per bag', business: 'BuildRight Materials', location: 'Hyderabad', rating: 4.7, category: 'Construction' },
        { id: 7, name: 'Solar Panel 400W', image: null, price: '₹18,000', price_unit: 'per unit', business: 'Green Energy Solutions', location: 'Ahmedabad', rating: 4.8, category: 'Energy' },
        { id: 8, name: 'Packaging Boxes (Bulk)', image: null, price: '₹12', price_unit: 'per piece', business: 'Pack Solutions', location: 'Kolkata', rating: 4.3, category: 'Packaging' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getProducts(0, 8);
                // Use API data if available, otherwise use demo data
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(demoProducts);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                // Fallback to demo data on error
                setProducts(demoProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading products...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Package className="h-4 w-4" />
                            Fresh Arrivals
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Latest Products
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Discover trending products from verified suppliers
                        </p>
                    </div>
                    <Link
                        to="/search?type=products"
                        className="mt-6 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                    >
                        View All Products
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product, index) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                )}

                                {/* Overlay actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                                            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                                        </button>
                                        <button className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                                            <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Category badge */}
                                {product.category && (
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium text-gray-700 px-2 py-1 rounded-lg">
                                        {product.category}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                                    {product.name}
                                </h3>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {product.price}
                                    </span>
                                    <span className="text-xs text-gray-500">{product.price_unit || 'per unit'}</span>
                                </div>

                                <p className="text-xs text-gray-600 truncate mb-3">{product.business}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="h-3 w-3" />
                                        <span>{product.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-xs font-medium text-gray-700">{product.rating || 4.5}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsGrid;
