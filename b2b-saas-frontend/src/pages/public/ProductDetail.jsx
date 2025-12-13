import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Phone,
    Mail,
    Star,
    Package,
    ShoppingCart,
    Heart,
    Share2,
    Check,
    Loader2,
    MessageCircle,
    Send,
    BadgeCheck
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getProductDetail(id);
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!product?.business?.id) return;

        try {
            setInquirySubmitting(true);
            await publicApi.submitInquiry({
                ...inquiryForm,
                business_id: product.business.id,
                product_id: product.id,
                message: `Inquiry about: ${product.name}\n\n${inquiryForm.message}`
            });
            setInquirySuccess(true);
            setInquiryForm({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setInquirySuccess(false), 5000);
        } catch (err) {
            alert('Failed to submit inquiry');
        } finally {
            setInquirySubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4 inline mr-2" /> Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const images = product.gallery || [product.main_image];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-blue-600">Home</Link>
                        <span>/</span>
                        <Link to="/search?type=products" className="hover:text-blue-600">Products</Link>
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center">
                            {product.main_image ? (
                                <img src={product.main_image} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                                <Package className="w-24 h-24 text-gray-300" />
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 ${selectedImage === idx ? 'border-blue-500' : 'border-gray-200'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            {product.category && (
                                <span className="text-sm text-blue-600 font-medium">{product.category}</span>
                            )}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>

                            <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                    <span className="ml-2 text-gray-600">(4.5 Rating)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <p className="text-sm text-gray-500 mb-1">Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-600">{product.price_formatted}</span>
                                <span className="text-gray-500">per unit</span>
                            </div>
                            {product.stock_status && (
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock_status === 'in_stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {product.short_description && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600">{product.short_description}</p>
                            </div>
                        )}

                        {product.features && product.features.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Seller Info */}
                        {product.business && (
                            <div className="bg-white rounded-xl p-5 border border-gray-200">
                                <p className="text-sm text-gray-500 mb-3">Sold by</p>
                                <Link to={`/business/${product.business.id}`} className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                        {product.business.logo ? (
                                            <img src={product.business.logo} alt="" className="w-10 h-10 object-contain" />
                                        ) : (
                                            <Building2 className="w-7 h-7 text-blue-600" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 group-hover:text-blue-600">{product.business.name}</span>
                                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                                        </div>
                                        {product.business.location && (
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <MapPin className="h-4 w-4" />
                                                {product.business.location}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex gap-2 mt-4">
                                    {product.business.phone && (
                                        <a href={`tel:${product.business.phone}`} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                            <Phone className="h-4 w-4" /> Call Now
                                        </a>
                                    )}
                                    <Link to={`/business/${product.business.id}`} className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Full Description & Specifications */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {product.full_description && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                                <p className="text-gray-600 whitespace-pre-line">{product.full_description}</p>
                            </div>
                        )}

                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500">{key}</span>
                                            <span className="text-gray-900 font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Inquiry Form */}
                    <div className="bg-white rounded-2xl p-6 border h-fit sticky top-20">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            Get Best Quote
                        </h3>
                        {inquirySuccess ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-green-700 font-medium">Inquiry Sent!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <input type="text" placeholder="Your Name" value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" required />
                                <input type="email" placeholder="Email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" required />
                                <input type="tel" placeholder="Phone" value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
                                <textarea placeholder="Your requirement..." rows={3} value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg resize-none" required></textarea>
                                <button type="submit" disabled={inquirySubmitting} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {inquirySubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    {inquirySubmitting ? 'Sending...' : 'Send Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {product.related && product.related.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.related.map((item) => (
                                <Link key={item.id} to={`/product/${item.id}`} className="bg-white rounded-xl border p-4 hover:shadow-lg transition-all group">
                                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <Package className="w-10 h-10 text-gray-300" />
                                        )}
                                    </div>
                                    <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">{item.name}</h4>
                                    <p className="text-blue-600 font-semibold mt-1">{item.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;
