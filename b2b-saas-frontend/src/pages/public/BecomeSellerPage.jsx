import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Store, ArrowRight, CheckCircle, TrendingUp, Users, Globe,
    Shield, Zap, BarChart3, Headphones, Package, Star,
    BadgeCheck, Clock, CreditCard, Sparkles, Target, Award
} from 'lucide-react';
import { Navbar, Footer } from '@/components/landing';

const benefits = [
    {
        icon: Globe,
        title: 'Nationwide Reach',
        description: 'Connect with buyers across India. Expand your business beyond geographical boundaries.',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        icon: BadgeCheck,
        title: 'Trust & Credibility',
        description: 'Get verified badge and build trust with authentic buyer inquiries.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: TrendingUp,
        title: 'Grow Your Sales',
        description: 'Access thousands of potential buyers actively looking for products like yours.',
        color: 'from-orange-500 to-red-500'
    },
    {
        icon: BarChart3,
        title: 'Business Analytics',
        description: 'Track your performance with detailed analytics and insights dashboard.',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Dedicated support team to help you succeed on our platform.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Shield,
        title: 'Secure Platform',
        description: 'Your data is protected with enterprise-grade security measures.',
        color: 'from-gray-600 to-gray-800'
    }
];

const steps = [
    {
        number: '01',
        title: 'Create Your Account',
        description: 'Sign up for free in just 2 minutes with your business details.',
        icon: Store
    },
    {
        number: '02',
        title: 'Set Up Your Profile',
        description: 'Add your company information, logo, and business description.',
        icon: Users
    },
    {
        number: '03',
        title: 'List Your Products',
        description: 'Upload your products with images, descriptions, and pricing.',
        icon: Package
    },
    {
        number: '04',
        title: 'Start Receiving Inquiries',
        description: 'Get genuine buyer inquiries and grow your business.',
        icon: Target
    }
];

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        period: 'Forever',
        description: 'Perfect for small businesses just getting started',
        features: [
            'Up to 20 product listings',
            'Basic business profile',
            'Receive buyer inquiries',
            'Email notifications',
            'Basic analytics'
        ],
        cta: 'Get Started Free',
        popular: false
    },
    {
        name: 'Professional',
        price: '₹999',
        period: '/month',
        description: 'For growing businesses that want more visibility',
        features: [
            'Unlimited product listings',
            'Verified seller badge',
            'Priority in search results',
            'Advanced analytics dashboard',
            'Featured business placement',
            'Dedicated account manager',
            'Premium support'
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'Contact us',
        description: 'For large businesses with custom requirements',
        features: [
            'Everything in Professional',
            'Custom branding options',
            'API access',
            'Multiple user accounts',
            'Custom integrations',
            'SLA guarantee',
            'On-call support'
        ],
        cta: 'Contact Sales',
        popular: false
    }
];

const testimonials = [
    {
        name: 'Rajesh Kumar',
        company: 'Steel Industries Pvt Ltd',
        location: 'Mumbai',
        quote: 'Since joining this platform, our business inquiries have increased by 300%. The quality of leads is exceptional.',
        rating: 5
    },
    {
        name: 'Priya Sharma',
        company: 'Fashion Trends',
        location: 'Jaipur',
        quote: 'Easy to use platform with great support. We\'ve expanded to 5 new states thanks to the nationwide reach.',
        rating: 5
    },
    {
        name: 'Amit Patel',
        company: 'Agro Solutions',
        location: 'Ahmedabad',
        quote: 'The verified seller badge helped us build trust with new customers. Highly recommend for B2B businesses.',
        rating: 5
    }
];

const BecomeSellerPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl"
                    />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
                </div>

                <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-white text-sm font-medium">Join 10,000+ Sellers</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                        >
                            Grow Your Business
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent"
                            >
                                With Us
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto"
                        >
                            Reach millions of buyers across India. List your products for free and start receiving genuine business inquiries today.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Start Selling Free
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/businesses"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                View Success Stories
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
                        >
                            {[
                                { value: '10K+', label: 'Active Sellers' },
                                { value: '50K+', label: 'Monthly Inquiries' },
                                { value: '500+', label: 'Cities Covered' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-indigo-200 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
                            <Award className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-600 text-sm font-semibold">Why Sell With Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We provide all the tools and support you need to grow your B2B business online.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`inline-flex p-3 bg-gradient-to-br ${benefit.color} rounded-xl text-white mb-4`}>
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                            <Zap className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-600 text-sm font-semibold">Simple Process</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Get Started in 4 Easy Steps
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Start selling within minutes. No technical skills required.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-indigo-300 to-transparent" />
                                )}
                                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                            {step.number}
                                        </div>
                                        <step.icon className="w-8 h-8 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
                            <CreditCard className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 text-sm font-semibold">Pricing Plans</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Choose Your Plan
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Start free and upgrade as you grow. No hidden fees.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={`relative rounded-2xl p-8 ${plan.popular
                                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105'
                                    : 'bg-white border-2 border-gray-200'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-sm font-bold rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={plan.popular ? 'text-indigo-200' : 'text-gray-500'}>
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className={`mt-2 text-sm ${plan.popular ? 'text-indigo-200' : 'text-gray-500'}`}>
                                        {plan.description}
                                    </p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-2">
                                            <CheckCircle className={`w-5 h-5 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} />
                                            <span className={plan.popular ? 'text-indigo-100' : 'text-gray-600'}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/register"
                                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${plan.popular
                                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
                            <Star className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600 text-sm font-semibold">Success Stories</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Trusted by Businesses Like Yours
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">{testimonial.company}, {testimonial.location}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Grow Your Business?
                        </h2>
                        <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                            Join thousands of successful sellers. Start for free today – no credit card required.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            <Store className="w-6 h-6" />
                            Start Selling Now – It's Free
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                        <p className="text-white/60 text-sm mt-6">
                            ✓ Free forever plan available &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Setup in 2 minutes
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default BecomeSellerPage;
