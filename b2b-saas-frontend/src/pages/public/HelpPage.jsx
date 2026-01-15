import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HelpCircle, Search, ChevronDown, ChevronRight, ArrowRight,
    MessageCircle, Mail, Phone, Clock, Sparkles,
    FileText, ShoppingBag, Building2, CreditCard, Shield, Settings,
    Users, Package, Briefcase, Globe, AlertCircle, CheckCircle
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';
import { siteSettingsApi } from '@/api/endpoints/siteSettings';
import * as Icons from 'lucide-react';

// Helper to get icon component dynamically
const getIcon = (iconName) => {
    const Icon = Icons[iconName] || HelpCircle;
    return Icon;
};

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [openFaqs, setOpenFaqs] = useState({});
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const settings = await siteSettingsApi.getPublicSettings();
                if (settings && settings.help_center_content) {
                    setContent(settings.help_center_content);
                    // Set first category as active by default if exists
                    if (settings.help_center_content.categories?.length > 0) {
                        setActiveCategory(0); // Use index as ID for simplicity or add IDs
                    }
                }
            } catch (error) {
                console.error('Failed to fetch help content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const toggleFaq = (categoryId, faqIndex) => {
        const key = `${categoryId}-${faqIndex}`;
        setOpenFaqs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!content) return null; // Or some fallback state

    const currentCategory = content.categories?.[activeCategory];

    // Filter logic
    const filteredFaqs = searchQuery
        ? content.categories.flatMap((cat, catIndex) =>
            (cat.faqs || []).filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(faq => ({ ...faq, category: cat.name, categoryId: catIndex }))
        )
        : [];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Hero Header */}
            <div className="relative pt-40 pb-16 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-70" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                            <HelpCircle className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-600 text-sm font-semibold">Help Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                                {content.title || "How Can We Help?"}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {content.subtitle || "Find answers to common questions or reach out to our support team."}
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={content.search_placeholder || "Search for help articles..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 font-medium shadow-lg shadow-gray-100/50 transition-all hover:shadow-xl"
                            />
                        </div>

                        {/* Search Results */}
                        {searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                            >
                                {filteredFaqs.length > 0 ? (
                                    <div className="max-h-80 overflow-y-auto">
                                        {filteredFaqs.map((faq, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setActiveCategory(faq.categoryId);
                                                    setSearchQuery('');
                                                    toggleFaq(faq.categoryId, index); // Note: index logic might need adjustment if relying on original index in cat
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                            >
                                                <p className="font-medium text-gray-900">{faq.question}</p>
                                                <p className="text-sm text-indigo-600">{faq.category}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Quick Links Categories */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                >
                    {(content.categories || []).map((category, index) => {
                        const IconComponent = getIcon(category.icon);
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveCategory(index)}
                                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${activeCategory === index
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md'
                                    }`}
                            >
                                <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl text-white`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <span className={`text-sm font-semibold text-center ${activeCategory === index ? 'text-indigo-600' : 'text-gray-700'
                                    }`}>
                                    {category.name}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        {currentCategory && (
                            <>
                                <div className={`p-2 bg-gradient-to-br ${currentCategory.color} rounded-lg text-white`}>
                                    {(() => {
                                        const Icon = getIcon(currentCategory.icon);
                                        return <Icon className="w-5 h-5" />;
                                    })()}
                                </div>
                                {currentCategory.name}
                            </>
                        )}
                    </h2>

                    <div className="space-y-4">
                        {currentCategory?.faqs?.map((faq, index) => {
                            const isOpen = openFaqs[`${activeCategory}-${index}`];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <button
                                        onClick={() => toggleFaq(activeCategory, index)}
                                        className="w-full flex items-center justify-between p-5 text-left"
                                    >
                                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Contact Support Section */}
            <div className="bg-white py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our support team is here to help you. Choose your preferred way to reach us.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(content.support_options || []).map((contact, index) => {
                            const IconComponent = getIcon(contact.icon);
                            return (
                                <motion.a
                                    key={index}
                                    href={contact.link}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="group bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all"
                                >
                                    <div className={`inline-flex p-3 bg-gradient-to-br ${contact.color || 'from-gray-500 to-slate-500'} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                                    <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                                        {contact.action}
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </motion.a>
                            );
                        })}
                    </div>

                    {/* Business Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                                <span className="font-semibold">Business Hours:</span> Monday - Saturday, 9:00 AM - 6:00 PM IST
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Join thousands of businesses already growing on our platform.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Create Free Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/businesses"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <Globe className="w-5 h-5" />
                                Browse Businesses
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HelpPage;
