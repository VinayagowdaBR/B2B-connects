import { Search, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            step: 1,
            icon: Search,
            title: 'Search & Discover',
            description: 'Search for products or services you need from thousands of verified suppliers.',
            color: 'bg-blue-500',
        },
        {
            step: 2,
            icon: MessageCircle,
            title: 'Connect & Negotiate',
            description: 'Send inquiries directly to sellers and negotiate the best deals for your business.',
            color: 'bg-orange-500',
        },
        {
            step: 3,
            icon: ShoppingBag,
            title: 'Order & Grow',
            description: 'Complete your order with trusted sellers and grow your business together.',
            color: 'bg-green-500',
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        How It Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Simple steps to connect with the right suppliers for your business
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <div key={step.step} className="relative">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200">
                                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 h-5 w-5" />
                                    </div>
                                )}

                                <div className="relative bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100">
                                    {/* Step Number */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mt-4 mb-4`}>
                                        <IconComponent className="h-8 w-8 text-white" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
