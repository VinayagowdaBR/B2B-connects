import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, MapPin } from 'lucide-react';

const ProductsGrid = () => {
    // Demo data - will be replaced with API data
    const products = [
        {
            id: 1,
            name: 'Industrial CNC Machine',
            image: null,
            price: '₹5,50,000',
            priceUnit: 'per unit',
            business: 'Tech Machinery Ltd',
            location: 'Mumbai',
            rating: 4.7,
        },
        {
            id: 2,
            name: 'Stainless Steel Pipes',
            image: null,
            price: '₹450',
            priceUnit: 'per kg',
            business: 'Steel Industries',
            location: 'Pune',
            rating: 4.5,
        },
        {
            id: 3,
            name: 'Organic Rice (Bulk)',
            image: null,
            price: '₹65',
            priceUnit: 'per kg',
            business: 'Agro Fresh Foods',
            location: 'Chennai',
            rating: 4.8,
        },
        {
            id: 4,
            name: 'Digital Blood Pressure Monitor',
            image: null,
            price: '₹2,500',
            priceUnit: 'per unit',
            business: 'Medical Equipments Co',
            location: 'Delhi',
            rating: 4.6,
        },
        {
            id: 5,
            name: 'Cotton Fabric Roll',
            image: null,
            price: '₹180',
            priceUnit: 'per meter',
            business: 'Fashion Textile Hub',
            location: 'Bangalore',
            rating: 4.4,
        },
        {
            id: 6,
            name: 'Cement (OPC 53 Grade)',
            image: null,
            price: '₹380',
            priceUnit: 'per bag',
            business: 'BuildRight Materials',
            location: 'Hyderabad',
            rating: 4.7,
        },
        {
            id: 7,
            name: 'Solar Panel 400W',
            image: null,
            price: '₹18,000',
            priceUnit: 'per unit',
            business: 'Green Energy Solutions',
            location: 'Ahmedabad',
            rating: 4.8,
        },
        {
            id: 8,
            name: 'Packaging Boxes (Bulk)',
            image: null,
            price: '₹12',
            priceUnit: 'per piece',
            business: 'Pack Solutions',
            location: 'Kolkata',
            rating: 4.3,
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Latest Products
                        </h2>
                        <p className="text-gray-600">
                            Discover trending products from verified suppliers
                        </p>
                    </div>
                    <Link
                        to="/search?type=products"
                        className="mt-4 md:mt-0 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View All Products
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-3 md:p-4">
                                <h3 className="font-medium text-gray-900 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                                    {product.name}
                                </h3>

                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-lg md:text-xl font-bold text-gray-900">{product.price}</span>
                                    <span className="text-xs text-gray-500">{product.priceUnit}</span>
                                </div>

                                <p className="text-xs text-gray-600 truncate">{product.business}</p>

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin className="h-3 w-3" />
                                        <span>{product.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-xs font-medium">{product.rating}</span>
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
