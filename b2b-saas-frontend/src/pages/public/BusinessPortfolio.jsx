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
    Twitter,
    Linkedin,
    Instagram,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';

const BusinessPortfolio = () => {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('about');
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    // Demo data - will be replaced with API data
    const business = {
        id: 1,
        slug: slug,
        name: 'Tech Solutions Pvt Ltd',
        tagline: 'Innovative Technology Solutions for Modern Businesses',
        logo: null,
        heroImage: null,
        category: 'IT Services',
        location: 'Bangalore, Karnataka',
        address: '123 Tech Park, Whitefield, Bangalore - 560066',
        rating: 4.8,
        reviews: 156,
        isVerified: true,
        foundedYear: 2015,
        employeeCount: '50-100',
        about: 'Tech Solutions Pvt Ltd is a leading provider of enterprise software solutions and IT consulting services. With over 8 years of experience, we have helped hundreds of businesses transform their digital infrastructure.',
        mission: 'To empower businesses with cutting-edge technology solutions that drive growth and innovation.',
        vision: 'To be the most trusted technology partner for businesses across India.',
        email: 'contact@techsolutions.com',
        phone: '+91 98765 43210',
        website: 'www.techsolutions.com',
        socialLinks: {
            facebook: '#',
            twitter: '#',
            linkedin: '#',
            instagram: '#',
        },
        products: [
            { id: 1, name: 'Enterprise ERP System', price: '₹50,000', image: null },
            { id: 2, name: 'CRM Software', price: '₹25,000', image: null },
            { id: 3, name: 'HR Management Suite', price: '₹35,000', image: null },
            { id: 4, name: 'Inventory Management', price: '₹20,000', image: null },
        ],
        services: [
            { id: 1, name: 'Custom Software Development', description: 'Tailored software solutions for your business needs' },
            { id: 2, name: 'Cloud Migration', description: 'Seamless migration to cloud infrastructure' },
            { id: 3, name: 'IT Consulting', description: 'Expert advice on technology strategy' },
            { id: 4, name: 'Mobile App Development', description: 'iOS and Android app development' },
        ],
        team: [
            { id: 1, name: 'Rajesh Kumar', role: 'CEO & Founder', image: null },
            { id: 2, name: 'Priya Sharma', role: 'CTO', image: null },
            { id: 3, name: 'Amit Patel', role: 'Head of Sales', image: null },
        ],
        testimonials: [
            { id: 1, name: 'John Doe', company: 'ABC Corp', text: 'Excellent service and support. Highly recommended!', rating: 5 },
            { id: 2, name: 'Jane Smith', company: 'XYZ Ltd', text: 'Their ERP system transformed our operations.', rating: 5 },
        ],
    };

    const tabs = [
        { id: 'about', label: 'About', icon: Building2 },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ];

    const handleInquirySubmit = (e) => {
        e.preventDefault();
        console.log('Inquiry submitted:', inquiryForm);
        alert('Inquiry submitted successfully!');
        setInquiryForm({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-4">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
                    </Link>

                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                            {business.logo ? (
                                <img src={business.logo} alt={business.name} className="w-20 h-20 object-contain" />
                            ) : (
                                <Building2 className="w-12 h-12 text-blue-500" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold">{business.name}</h1>
                                {business.isVerified && (
                                    <BadgeCheck className="h-6 w-6 text-yellow-400" />
                                )}
                            </div>
                            <p className="text-blue-100 mb-3">{business.tagline}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{business.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span>{business.rating} ({business.reviews} reviews)</span>
                                </div>
                                <span className="bg-blue-500 px-3 py-1 rounded-full text-xs">
                                    {business.category}
                                </span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-col gap-2">
                            <a
                                href={`tel:${business.phone}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                            >
                                <Phone className="h-4 w-4" /> Call Now
                            </a>
                            <a
                                href={`mailto:${business.email}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                            >
                                <Mail className="h-4 w-4" /> Send Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
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
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">About Us</h2>
                                <p className="text-gray-600 mb-6">{business.about}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-500 text-sm">Founded</p>
                                        <p className="font-semibold">{business.foundedYear}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-500 text-sm">Employees</p>
                                        <p className="font-semibold">{business.employeeCount}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold mb-2">Our Mission</h3>
                                    <p className="text-gray-600 mb-4">{business.mission}</p>
                                    <h3 className="font-semibold mb-2">Our Vision</h3>
                                    <p className="text-gray-600">{business.vision}</p>
                                </div>
                            </div>
                        )}

                        {/* Products Tab */}
                        {activeTab === 'products' && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Our Products</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {business.products.map((product) => (
                                        <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                                                <Package className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="font-medium">{product.name}</h3>
                                            <p className="text-blue-600 font-semibold">{product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Our Services</h2>
                                <div className="space-y-4">
                                    {business.services.map((service) => (
                                        <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                            <h3 className="font-medium text-lg">{service.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Team Tab */}
                        {activeTab === 'team' && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Our Team</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {business.team.map((member) => (
                                        <div key={member.id} className="text-center p-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Users className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="font-medium">{member.name}</h3>
                                            <p className="text-gray-500 text-sm">{member.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                                <div className="space-y-4">
                                    {business.testimonials.map((review) => (
                                        <div key={review.id} className="border-b border-gray-100 pb-4">
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 mb-2">"{review.text}"</p>
                                            <p className="text-sm font-medium">{review.name}</p>
                                            <p className="text-sm text-gray-500">{review.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">{business.address}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <a href={`tel:${business.phone}`} className="text-sm text-blue-600 hover:underline">
                                        {business.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <a href={`mailto:${business.email}`} className="text-sm text-blue-600 hover:underline">
                                        {business.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                    <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                        {business.website}
                                    </a>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                <a href={business.socialLinks.facebook} className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <Facebook className="h-4 w-4 text-gray-600" />
                                </a>
                                <a href={business.socialLinks.twitter} className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <Twitter className="h-4 w-4 text-gray-600" />
                                </a>
                                <a href={business.socialLinks.linkedin} className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <Linkedin className="h-4 w-4 text-gray-600" />
                                </a>
                                <a href={business.socialLinks.instagram} className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center hover:bg-blue-100 transition-colors">
                                    <Instagram className="h-4 w-4 text-gray-600" />
                                </a>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                Send Inquiry
                            </h3>
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={inquiryForm.name}
                                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={inquiryForm.email}
                                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={inquiryForm.phone}
                                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <textarea
                                    placeholder="Your Message"
                                    rows={4}
                                    value={inquiryForm.message}
                                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Inquiry
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BusinessPortfolio;
