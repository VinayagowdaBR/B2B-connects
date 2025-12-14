import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    Phone,
    Briefcase,
    Check,
    Loader2,
    MessageCircle,
    Send,
    BadgeCheck,
    Clock,
    DollarSign
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { publicApi } from '@/api/endpoints/publicApi';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquirySuccess, setInquirySuccess] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getServiceDetail(id);
                setService(data);
            } catch (err) {
                console.error('Error fetching service:', err);
                setError('Service not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchService();
        }
    }, [id]);

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!service?.business?.id) return;

        try {
            setInquirySubmitting(true);
            await publicApi.submitInquiry({
                ...inquiryForm,
                business_id: service.business.id,
                service_id: service.id,
                message: `Inquiry about service: ${service.title}\n\n${inquiryForm.message}`
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

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Service Not Found</h2>
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4 inline mr-2" /> Back to Home
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white pt-44 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
                        <Link to="/" className="hover:text-white">Home</Link>
                        <span>/</span>
                        <Link to="/search?type=services" className="hover:text-white">Services</Link>
                        <span>/</span>
                        <span className="text-white">{service.title}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
                            {service.icon ? (
                                <img src={service.icon} alt="" className="w-12 h-12 object-contain" />
                            ) : (
                                <Briefcase className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <div className="flex-1">
                            {service.category && (
                                <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm mb-3">
                                    {service.category}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">{service.title}</h1>
                            <p className="text-blue-100 text-lg max-w-2xl">{service.short_description}</p>

                            {service.pricing && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/20">
                                    <DollarSign className="h-5 w-5" />
                                    <span className="font-semibold">{service.pricing}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        {service.full_description && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <h2 className="text-xl font-semibold mb-4">About This Service</h2>
                                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{service.full_description}</p>
                            </div>
                        )}

                        {/* Features */}
                        {service.features && service.features.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Banner Image */}
                        {service.banner_image && (
                            <div className="bg-white rounded-2xl p-4 border overflow-hidden">
                                <img src={service.banner_image} alt={service.title} className="w-full h-64 object-cover rounded-xl" />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Service Provider */}
                        {service.business && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <p className="text-sm text-gray-500 mb-4">Service Provider</p>
                                <Link to={`/business/${service.business.id}`} className="flex items-center gap-4 group">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                        {service.business.logo ? (
                                            <img src={service.business.logo} alt="" className="w-10 h-10 object-contain" />
                                        ) : (
                                            <Building2 className="w-7 h-7 text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 group-hover:text-blue-600">{service.business.name}</span>
                                            <BadgeCheck className="h-5 w-5 text-blue-500" />
                                        </div>
                                        {service.business.location && (
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <MapPin className="h-4 w-4" />
                                                {service.business.location}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="flex flex-col gap-2 mt-4">
                                    {service.business.phone && (
                                        <a href={`tel:${service.business.phone}`} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                            <Phone className="h-4 w-4" /> Call Now
                                        </a>
                                    )}
                                    <Link to={`/business/${service.business.id}`} className="w-full py-2.5 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors">
                                        View Business Profile
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Inquiry Form */}
                        <div className="bg-white rounded-2xl p-6 border sticky top-48">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                Request This Service
                            </h3>
                            {inquirySuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Check className="h-8 w-8 text-green-600" />
                                    </div>
                                    <p className="text-green-700 font-medium">Request Sent!</p>
                                    <p className="text-sm text-gray-600 mt-1">We'll get back to you soon</p>
                                </div>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={inquiryForm.email}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={inquiryForm.phone}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        placeholder="Describe your requirement..."
                                        rows={4}
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={inquirySubmitting}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                                    >
                                        {inquirySubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" /> Send Request
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

export default ServiceDetail;
