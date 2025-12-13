import { useEffect, useState, useRef } from 'react';
import { Users, Building2, Package, ShoppingCart, TrendingUp, BadgeCheck } from 'lucide-react';
import { publicApi } from '@/api/endpoints/publicApi';

const StatsCounter = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [apiStats, setApiStats] = useState(null);
    const sectionRef = useRef(null);

    // Fetch stats from API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await publicApi.getStats();
                if (data) {
                    setApiStats(data);
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
                // Use defaults on error
            }
        };
        fetchStats();
    }, []);

    // Build stats array with API data or defaults
    const currentStats = apiStats || {
        buyers: 50000,
        verified_sellers: 10000,
        total_listings: 100000,
        daily_inquiries: 25000
    };

    const stats = [
        {
            icon: Users,
            value: Math.max(currentStats.buyers || 0, 50000),
            suffix: '+',
            label: 'Registered Buyers',
            description: 'Active business buyers',
            gradient: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-500/10',
        },
        {
            icon: Building2,
            value: Math.max(currentStats.verified_sellers || 0, 10000),
            suffix: '+',
            label: 'Verified Sellers',
            description: 'Trusted suppliers',
            gradient: 'from-green-500 to-emerald-500',
            bgLight: 'bg-green-500/10',
        },
        {
            icon: Package,
            value: Math.max(currentStats.total_listings || 0, 100000),
            suffix: '+',
            label: 'Products Listed',
            description: 'Across categories',
            gradient: 'from-purple-500 to-violet-500',
            bgLight: 'bg-purple-500/10',
        },
        {
            icon: ShoppingCart,
            value: Math.max(currentStats.daily_inquiries || 0, 25000),
            suffix: '+',
            label: 'Daily Inquiries',
            description: 'Business connections',
            gradient: 'from-orange-500 to-amber-500',
            bgLight: 'bg-orange-500/10',
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
            <span className="tabular-nums">
                {formatNumber(count)}{suffix}
            </span>
        );
    };

    return (
        <section
            ref={sectionRef}
            className="py-16 md:py-20 relative overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/20">
                        <TrendingUp className="h-4 w-4" />
                        Growing Every Day
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Trusted by Thousands of Businesses
                    </h2>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Join India's fastest growing B2B marketplace and expand your business reach
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}></div>

                                <div className="relative">
                                    <div className={`w-14 h-14 ${stat.bgLight} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="h-7 w-7 text-white" />
                                    </div>

                                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                                    </div>

                                    <p className="text-white font-medium mb-1">{stat.label}</p>
                                    <p className="text-blue-200 text-sm">{stat.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
                    <div className="flex items-center gap-2 text-white/80">
                        <BadgeCheck className="h-5 w-5 text-green-400" />
                        <span className="text-sm">Verified Suppliers</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                        <BadgeCheck className="h-5 w-5 text-green-400" />
                        <span className="text-sm">Secure Transactions</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                        <BadgeCheck className="h-5 w-5 text-green-400" />
                        <span className="text-sm">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                        <BadgeCheck className="h-5 w-5 text-green-400" />
                        <span className="text-sm">Pan-India Network</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsCounter;
