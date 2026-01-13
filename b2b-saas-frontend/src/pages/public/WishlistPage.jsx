import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowRight, Star, ShieldCheck, ExternalLink } from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { useNavigate, Link } from 'react-router-dom';
import { wishlistApi } from '@/api/endpoints/wishlist';
import { AuthContext } from '@/contexts/AuthContext';

const WishlistPage = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            if (isAuthenticated) {
                try {
                    const data = await wishlistApi.getAll();
                    setWishlistItems(data);
                } catch (error) {
                    console.error("Failed to fetch wishlist", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [isAuthenticated]);

    const removeFromWishlist = async (productId) => {
        try {
            await wishlistApi.remove(productId);
            setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 text-center pt-40">
                <Navbar />
                <h2 className="text-2xl font-bold">Please login to view your wishlist</h2>
                <Link to="/login" className="text-indigo-600 hover:underline mt-4 block">Login here</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            <div className="pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-pink-500 fill-current" />
                            My Wishlist
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {wishlistItems.length} items
                            </span>
                        </h1>
                    </div>

                    {/* Wishlist Grid */}
                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {wishlistItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group"
                                    >
                                        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <img
                                                src={item.product_image || "https://via.placeholder.com/400x300?text=No+Image"}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => removeFromWishlist(item.product_id)}
                                                    className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm"
                                                    title="Remove from wishlist"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-5">
                                            <div className="mb-3">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                                                    {item.product_name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                                                        Electronics
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-0.5">Price</p>
                                                    <p className="text-xl font-bold text-gray-900">
                                                        ₹{item.product_price?.toLocaleString() || 'N/A'}
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/product/${item.product_slug}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-pink-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                Save items you're interested in to track their availability and price.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Browse Products
                                <ArrowRight className="w-4 h-4" />
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
