import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Heart, Package, ArrowRight, Trash2, ShoppingBag,
    Star, MapPin, Building2, BadgeCheck
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';

const WishlistPage = () => {
    // Mock wishlist data - in a real app, this would come from a context or API
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: 'Industrial CNC Machine',
            price: '₹5,50,000',
            business_name: 'Tech Machinery Ltd',
            location: 'Mumbai',
            rating: 4.7,
            image: null,
            inStock: true
        },
        {
            id: 3,
            name: 'Organic Rice (Bulk)',
            price: '₹65/kg',
            business_name: 'Agro Fresh Foods',
            location: 'Chennai',
            rating: 4.8,
            image: null,
            inStock: true
        },
        {
            id: 4,
            name: 'Medical Surgical Gloves',
            price: '₹450/box',
            business_name: 'MediCare Plus',
            location: 'Delhi',
            rating: 4.9,
            image: null,
            inStock: false
        }
    ]);

    const removeFromWishlist = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-red-500 fill-current" />
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {wishlistItems.length} items saved for later
                        </p>
                    </div>

                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative"
                                >
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <Link to={`/product/${item.id}`} className="block">
                                        {/* Image Placeholder */}
                                        <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                            <Package className="w-12 h-12 text-gray-300" />
                                            {!item.inStock && (
                                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-lg font-bold text-indigo-600 mb-3">
                                                {item.price}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                                <Building2 className="w-3.5 h-3.5" />
                                                <span className="truncate">{item.business_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{item.location}</span>
                                            </div>

                                            <button className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
                                                <ShoppingBag className="w-4 h-4" />
                                                View Details
                                            </button>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                Browse products and find items you love to save them here for later.
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Explore Products
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WishlistPage;
