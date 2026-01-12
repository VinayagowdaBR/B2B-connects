import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HelpCircle, Search, ChevronDown, ChevronRight, ArrowRight,
    MessageCircle, Mail, Phone, Clock, Sparkles,
    FileText, ShoppingBag, Building2, CreditCard, Shield, Settings,
    Users, Package, Briefcase, Globe, AlertCircle, CheckCircle
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';

const faqCategories = [
    {
        id: 'getting-started',
        name: 'Getting Started',
        icon: Sparkles,
        color: 'from-indigo-500 to-purple-500',
        faqs: [
            {
                question: 'How do I create an account?',
                answer: 'Click on the "Register" button in the top navigation. Fill in your business details, email, and password. Verify your email address to complete registration. You can then set up your company profile and start listing products.'
            },
            {
                question: 'Is registration free?',
                answer: 'Yes! Basic registration is completely free. You can create your business profile, list products, and receive inquiries at no cost. We also offer premium plans with additional features like priority listing and advanced analytics.'
            },
            {
                question: 'How do I verify my business?',
                answer: 'After registration, go to your dashboard and click on "Get Verified". Upload your business documents (GST certificate, business license, etc.). Our team will review and verify your business within 24-48 hours.'
            },
            {
                question: 'What documents are needed for verification?',
                answer: 'Required documents include: GST Registration Certificate, Business PAN Card, Address Proof (utility bill or bank statement), and optionally, Trade License or Shop Act License for enhanced trust.'
            }
        ]
    },
    {
        id: 'products-services',
        name: 'Products & Services',
        icon: Package,
        color: 'from-orange-500 to-red-500',
        faqs: [
            {
                question: 'How do I list my products?',
                answer: 'Go to Dashboard > Products > Add New Product. Fill in the product details including name, description, price, category, and upload high-quality images. Click "Publish" to make it live on the platform.'
            },
            {
                question: 'How many products can I list?',
                answer: 'Free accounts can list up to 20 products. Premium plans offer unlimited listings along with featured placement and priority in search results.'
            },
            {
                question: 'Can I offer both products and services?',
                answer: 'Absolutely! You can list both products and services from your dashboard. Each has its own section with relevant fields optimized for that type of offering.'
            },
            {
                question: 'How do I update my product prices?',
                answer: 'Navigate to Dashboard > Products, find the product you want to update, click Edit, modify the price, and save changes. The update will reflect immediately on your public profile.'
            }
        ]
    },
    {
        id: 'inquiries',
        name: 'Inquiries & Orders',
        icon: MessageCircle,
        color: 'from-green-500 to-emerald-500',
        faqs: [
            {
                question: 'How do I receive inquiries?',
                answer: 'When buyers are interested in your products, they submit an inquiry through your business profile. You\'ll receive notifications via email and in your dashboard. Respond promptly to convert leads!'
            },
            {
                question: 'How quickly should I respond to inquiries?',
                answer: 'We recommend responding within 24 hours. Businesses with faster response times rank higher in search results and receive a "Quick Response" badge on their profile.'
            },
            {
                question: 'Can I filter and manage inquiries?',
                answer: 'Yes! Your dashboard has a complete inquiry management system. Filter by status (new, responded, converted), date range, product, and more. You can also add notes and track follow-ups.'
            }
        ]
    },
    {
        id: 'account-billing',
        name: 'Account & Billing',
        icon: CreditCard,
        color: 'from-blue-500 to-cyan-500',
        faqs: [
            {
                question: 'How do I upgrade to a premium plan?',
                answer: 'Go to Dashboard > Subscription > Upgrade. Choose your preferred plan and complete the payment. Premium features are activated instantly after successful payment.'
            },
            {
                question: 'What payment methods are accepted?',
                answer: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe. For enterprise plans, we also offer invoice-based payments.'
            },
            {
                question: 'Can I cancel my subscription?',
                answer: 'Yes, you can cancel anytime from Dashboard > Subscription > Manage. Your premium features will remain active until the end of your billing period.'
            },
            {
                question: 'How do I update my business information?',
                answer: 'Go to Dashboard > Company Info to update your business details, address, contact information, and company description. Changes are reflected immediately.'
            }
        ]
    },
    {
        id: 'security',
        name: 'Security & Privacy',
        icon: Shield,
        color: 'from-purple-500 to-pink-500',
        faqs: [
            {
                question: 'Is my business information secure?',
                answer: 'Yes! We use industry-standard encryption (SSL/TLS) for all data transmission. Your sensitive information is stored securely and never shared with third parties without consent.'
            },
            {
                question: 'How do I reset my password?',
                answer: 'Click "Forgot Password" on the login page, enter your registered email, and follow the instructions sent to your inbox. The reset link is valid for 24 hours.'
            },
            {
                question: 'Who can see my contact information?',
                answer: 'Only registered users can view your contact details after submitting an inquiry. This protects you from spam while ensuring genuine buyers can reach you.'
            }
        ]
    }
];

const HelpPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('getting-started');
    const [openFaqs, setOpenFaqs] = useState({});

    const toggleFaq = (categoryId, faqIndex) => {
        const key = `${categoryId}-${faqIndex}`;
        setOpenFaqs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const currentCategory = faqCategories.find(cat => cat.id === activeCategory);

    const filteredFaqs = searchQuery
        ? faqCategories.flatMap(cat =>
            cat.faqs.filter(faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(faq => ({ ...faq, category: cat.name, categoryId: cat.id }))
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
                                How Can We Help?
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Find answers to common questions or reach out to our support team for assistance.
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
                                placeholder="Search for help articles..."
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
                                                    toggleFaq(faq.categoryId, index);
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

            {/* Quick Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                >
                    {faqCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${activeCategory === category.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md'
                                }`}
                        >
                            <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl text-white`}>
                                <category.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-semibold text-center ${activeCategory === category.id ? 'text-indigo-600' : 'text-gray-700'
                                }`}>
                                {category.name}
                            </span>
                        </button>
                    ))}
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
                                    <currentCategory.icon className="w-5 h-5" />
                                </div>
                                {currentCategory.name}
                            </>
                        )}
                    </h2>

                    <div className="space-y-4">
                        {currentCategory?.faqs.map((faq, index) => {
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
                        {[
                            {
                                icon: Mail,
                                title: 'Email Support',
                                description: 'Send us an email and we\'ll respond within 24 hours.',
                                action: 'support@b2bconnect.com',
                                link: 'mailto:support@b2bconnect.com',
                                color: 'from-indigo-500 to-purple-500'
                            },
                            {
                                icon: Phone,
                                title: 'Phone Support',
                                description: 'Speak directly with our support team.',
                                action: '+91 1800-XXX-XXXX',
                                link: 'tel:+911800XXXXXXX',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: MessageCircle,
                                title: 'Live Chat',
                                description: 'Chat with us in real-time for instant help.',
                                action: 'Start Chat',
                                link: '#',
                                color: 'from-orange-500 to-red-500'
                            }
                        ].map((contact, index) => (
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
                                <div className={`inline-flex p-3 bg-gradient-to-br ${contact.color} rounded-xl text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    <contact.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                                <span className="inline-flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                                    {contact.action}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </motion.a>
                        ))}
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
