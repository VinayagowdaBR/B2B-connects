import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Star,
    BadgeCheck,
    Package,
    Briefcase,
    Users,
    MessageCircle,
    ArrowLeft,
    Send,
    Facebook,
    Linkedin,
    Instagram,
    Youtube,
    Loader2,
    Calendar,
    ExternalLink,
    Image as ImageIcon,
    FolderOpen
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const BusinessPortfolio = () => {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('about');
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await publicApi.getBusinessPortfolio(slug);
                setBusiness(data);
            } catch (err) {
                console.error('Error fetching business:', err);
                setError('Business not found or an error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBusiness();
        }
    }, [slug]);

    const tabs = [
        { id: 'about', label: 'About', icon: Building2 },
        { id: 'products', label: 'Products', icon: Package, count: business?.products?.length || 0 },
        { id: 'services', label: 'Services', icon: Briefcase, count: business?.services?.length || 0 },
        { id: 'projects', label: 'Projects', icon: FolderOpen, count: business?.projects?.length || 0 },
        { id: 'team', label: 'Team', icon: Users, count: business?.team?.length || 0 },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: business?.gallery?.length || 0 },
        { id: 'reviews', label: 'Reviews', icon: Star, count: business?.testimonials?.length || 0 },
    ];

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!business) return;

        try {
            setInquirySubmitting(true);
            await publicApi.submitInquiry({
                ...inquiryForm,
                business_id: business.tenant_id
            });
            setInquirySuccess(true);
            setInquiryForm({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setInquirySuccess(false), 5000);
        } catch (err) {
            console.error('Error submitting inquiry:', err);
            alert('Failed to submit inquiry. Please try again.');
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
                    <span className="ml-3 text-lg text-gray-600">Loading business profile...</span>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Business Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The business you are looking for does not exist.'}</p>
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white pt-44">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            {business.logo ? (
                                <img src={business.logo} alt={business.name} className="w-20 h-20 object-contain rounded-xl" />
                            ) : (
                                <Building2 className="w-12 h-12 text-blue-500" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold">{business.name}</h1>
                                {business.is_verified && (
                                    <BadgeCheck className="h-6 w-6 text-yellow-400" />
                                )}
                            </div>
                            <p className="text-blue-100 mb-3">{business.tagline || 'Trusted Business Partner'}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                {business.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{business.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span>{business.rating} ({business.reviews_count} reviews)</span>
                                </div>
                                <span className="bg-blue-500/30 backdrop-blur px-3 py-1 rounded-full text-xs border border-blue-400/30">
                                    {business.category}
                                </span>
                                {business.founding_year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Est. {business.founding_year}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-2">
                            {business.phone && (
                                <a
                                    href={`tel:${business.phone}`}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    <Phone className="h-4 w-4" /> Call Now
                                </a>
                            )}
                            {business.email && (
                                <a
                                    href={`mailto:${business.email}`}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                                >
                                    <Mail className="h-4 w-4" /> Send Email
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-44 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            // Hide tabs with no content
                            if (tab.count === 0 && tab.id !== 'about') return null;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">About Us</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {business.about || 'No description available.'}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {business.founding_year && (
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                            <p className="text-gray-500 text-sm">Founded</p>
                                            <p className="font-semibold text-gray-900">{business.founding_year}</p>
                                        </div>
                                    )}
                                    {business.company_size && (
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                            <p className="text-gray-500 text-sm">Employees</p>
                                            <p className="font-semibold text-gray-900">{business.company_size}</p>
                                        </div>
                                    )}
                                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                                        <p className="text-gray-500 text-sm">Products</p>
                                        <p className="font-semibold text-gray-900">{business.products_count}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                                        <p className="text-gray-500 text-sm">Services</p>
                                        <p className="font-semibold text-gray-900">{business.services_count}</p>
                                    </div>
                                </div>

                                {(business.mission || business.vision) && (
                                    <div className="border-t pt-6 space-y-4">
                                        {business.mission && (
                                            <div>
                                                <h3 className="font-semibold mb-2 text-blue-600">Our Mission</h3>
                                                <p className="text-gray-600">{business.mission}</p>
                                            </div>
                                        )}
                                        {business.vision && (
                                            <div>
                                                <h3 className="font-semibold mb-2 text-indigo-600">Our Vision</h3>
                                                <p className="text-gray-600">{business.vision}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Products Tab */}
                        {activeTab === 'products' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Our Products</h2>
                                {business.products?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {business.products.map((product) => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                                            >
                                                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    ) : (
                                                        <Package className="h-8 w-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <h3 className="font-medium group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                                <p className="text-blue-600 font-semibold">{product.price_formatted}</p>
                                                {product.description && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No products available.</p>
                                )}
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Our Services</h2>
                                {business.services?.length > 0 ? (
                                    <div className="space-y-4">
                                        {business.services.map((service) => (
                                            <Link
                                                key={service.id}
                                                to={`/service/${service.id}`}
                                                className="block border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Briefcase className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-lg group-hover:text-blue-600 transition-colors">{service.title}</h3>
                                                        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                                        {service.pricing && (
                                                            <span className="inline-block mt-2 text-sm text-blue-600 font-medium">{service.pricing}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No services available.</p>
                                )}
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Our Projects</h2>
                                {business.projects?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {business.projects.map((project) => (
                                            <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
                                                <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                                    {project.image ? (
                                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FolderOpen className="h-10 w-10 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium">{project.title}</h3>
                                                    {project.client && (
                                                        <p className="text-sm text-gray-500">Client: {project.client}</p>
                                                    )}
                                                    {project.description && (
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                                                    )}
                                                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No projects available.</p>
                                )}
                            </div>
                        )}

                        {/* Team Tab */}
                        {activeTab === 'team' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Our Team</h2>
                                {business.team?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {business.team.map((member) => (
                                            <div key={member.id} className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Users className="h-8 w-8 text-blue-500" />
                                                    )}
                                                </div>
                                                <h3 className="font-medium">{member.name}</h3>
                                                <p className="text-gray-500 text-sm">{member.position}</p>
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-sm mt-2 hover:underline">
                                                        <Linkedin className="h-3 w-3" /> LinkedIn
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No team members available.</p>
                                )}
                            </div>
                        )}

                        {/* Gallery Tab */}
                        {activeTab === 'gallery' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                                {business.gallery?.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {business.gallery.map((image) => (
                                            <div key={image.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                                <img src={image.image} alt={image.title || 'Gallery'} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No gallery images available.</p>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                                {business.testimonials?.length > 0 ? (
                                    <div className="space-y-4">
                                        {business.testimonials.map((review) => (
                                            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600 mb-2 italic">"{review.content}"</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                        {review.image ? (
                                                            <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Users className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{review.name}</p>
                                                        <p className="text-sm text-gray-500">{review.designation}, {review.company}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No reviews available.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                {business.address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <span className="text-sm text-gray-600">
                                            {business.address}
                                            {business.city && `, ${business.city}`}
                                            {business.state && `, ${business.state}`}
                                            {business.postal_code && ` - ${business.postal_code}`}
                                        </span>
                                    </div>
                                )}
                                {business.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <a href={`tel:${business.phone}`} className="text-sm text-blue-600 hover:underline">
                                            {business.phone}
                                        </a>
                                    </div>
                                )}
                                {business.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <a href={`mailto:${business.email}`} className="text-sm text-blue-600 hover:underline">
                                            {business.email}
                                        </a>
                                    </div>
                                )}
                                {business.website && (
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                            {business.website} <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            {(business.facebook || business.linkedin || business.instagram || business.youtube) && (
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                    {business.facebook && (
                                        <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                                            <Facebook className="h-4 w-4 text-gray-600" />
                                        </a>
                                    )}
                                    {business.linkedin && (
                                        <a href={business.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                                            <Linkedin className="h-4 w-4 text-gray-600" />
                                        </a>
                                    )}
                                    {business.instagram && (
                                        <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-pink-100 transition-colors">
                                            <Instagram className="h-4 w-4 text-gray-600" />
                                        </a>
                                    )}
                                    {business.youtube && (
                                        <a href={business.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                                            <Youtube className="h-4 w-4 text-gray-600" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Inquiry Form */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                Send Inquiry
                            </h3>

                            {inquirySuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <BadgeCheck className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h4 className="font-medium text-green-700">Inquiry Sent!</h4>
                                    <p className="text-sm text-gray-600 mt-1">The business will contact you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={inquiryForm.email}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={inquiryForm.phone}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                    <textarea
                                        placeholder="Your Message"
                                        rows={4}
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={inquirySubmitting}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                                    >
                                        {inquirySubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" /> Send Inquiry
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BusinessPortfolio;
