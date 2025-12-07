import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Sparkles } from 'lucide-react';

const CTABanner = () => {
    return (
        <section className="py-12 md:py-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span className="text-white text-sm font-medium">Start Selling Today</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Grow Your Business with Us
                        </h2>
                        <p className="text-orange-100 text-lg max-w-xl">
                            Register your business and connect with thousands of buyers looking for your products and services.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            <Building2 className="h-5 w-5" />
                            Register Your Business
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                        >
                            Already a Member? Login
                        </Link>
                    </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/20">
                    {[
                        'Free Registration',
                        'Verified Buyers',
                        'Dedicated Support',
                        'Secure Payments',
                    ].map((benefit, index) => (
                        <div key={index} className="flex items-center justify-center gap-2 text-white/90">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-sm font-medium">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
