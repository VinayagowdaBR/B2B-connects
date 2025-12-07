import { useEffect, useState, useRef } from 'react';
import { Users, Building2, Package, ShoppingCart } from 'lucide-react';

const StatsCounter = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    const stats = [
        {
            icon: Users,
            value: 50000,
            suffix: '+',
            label: 'Registered Buyers',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            icon: Building2,
            value: 10000,
            suffix: '+',
            label: 'Verified Sellers',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            icon: Package,
            value: 100000,
            suffix: '+',
            label: 'Products Listed',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            icon: ShoppingCart,
            value: 25000,
            suffix: '+',
            label: 'Daily Inquiries',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const AnimatedCounter = ({ value, suffix, isVisible }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            const duration = 2000;
            const steps = 60;
            const stepValue = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += stepValue;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }, [value, isVisible]);

        const formatNumber = (num) => {
            if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
            if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
            return num.toLocaleString();
        };

        return (
            <span>
                {formatNumber(count)}{suffix}
            </span>
        );
    };

    return (
        <section
            ref={sectionRef}
            className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Trusted by Thousands of Businesses
                    </h2>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                        Join India's fastest growing B2B marketplace
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                    <IconComponent className={`h-7 w-7 ${stat.color}`} />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                                </div>
                                <p className="text-blue-100 text-sm md:text-base">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
