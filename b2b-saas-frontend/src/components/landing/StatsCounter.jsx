import { useEffect, useState } from 'react';
import { Users, Building2, Package, ShoppingCart, TrendingUp, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { publicApi } from '@/api/endpoints/publicApi';

const StatsCounter = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await publicApi.getSiteSettings();
        if (data) {
          setSiteSettings(data);
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Use dynamic stats from settings, fallback to defaults
  const statsData = {
    buyers: siteSettings?.stats_buyers || 50000,
    sellers: siteSettings?.stats_sellers || 10000,
    products: siteSettings?.stats_products || 100000,
    inquiries: siteSettings?.stats_inquiries || 25000
  };

  const stats = [
    { icon: Users, value: statsData.buyers, suffix: '+', label: 'Registered Buyers', description: 'Active business buyers', gradient: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-500/10' },
    { icon: Building2, value: statsData.sellers, suffix: '+', label: 'Verified Sellers', description: 'Trusted suppliers', gradient: 'from-green-500 to-emerald-500', bgLight: 'bg-green-500/10' },
    { icon: Package, value: statsData.products, suffix: '+', label: 'Products Listed', description: 'Across categories', gradient: 'from-purple-500 to-violet-500', bgLight: 'bg-purple-500/10' },
    { icon: ShoppingCart, value: statsData.inquiries, suffix: '+', label: 'Daily Inquiries', description: 'Business connections', gradient: 'from-orange-500 to-amber-500', bgLight: 'bg-orange-500/10' },
  ];

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
      <span className="text-5xl md:text-6xl font-bold">
        {formatNumber(count)}{suffix}
      </span>
    );
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-semibold">Growing Every Day</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Thousands of Businesses
          </h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Join India's fastest growing B2B marketplace and expand your business reach
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Card */}
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl mb-6 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Counter */}
                  <div className="mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      isVisible={inView}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-indigo-200 text-sm">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { icon: BadgeCheck, text: 'Verified Suppliers' },
            { icon: TrendingUp, text: 'Secure Transactions' },
            { icon: Users, text: '24/7 Support' },
            { icon: Package, text: 'Pan-India Network' },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl"
            >
              <item.icon className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium text-sm">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter;
