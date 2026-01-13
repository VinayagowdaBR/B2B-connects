import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BadgeCheck, Clock, HeadphonesIcon, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { publicApi } from '@/api/endpoints/publicApi';

const HeroSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularSearches, setPopularSearches] = useState([]);
  const navigate = useNavigate();

  const [heroContent, setHeroContent] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const settings = await publicApi.getSiteSettings();
      if (settings && settings.hero_content) {
        setHeroContent(settings.hero_content);
        if (settings.hero_content.popular_searches) {
          setPopularSearches(settings.hero_content.popular_searches);
        }
      } else {
        // Fallback default content
        setHeroContent({
          badge_text: "India's Most Trusted B2B Platform",
          title_prefix: "Discover Thousands of",
          title_highlight: "Trusted Suppliers",
          subtitle: "Connect with verified manufacturers, wholesalers, and service providers across India",
          popular_searches: ['Industrial Machinery', 'Steel Products', 'Medical Equipment', 'Electronics Components', 'Building Materials'],
          features: [
            { title: "Verified Sellers", desc: "100% Trusted & Verified" },
            { title: "Quick Response", desc: "Within 24 Hours" },
            { title: "24/7 Support", desc: "Always Available" }
          ]
        });
        setPopularSearches(['Industrial Machinery', 'Steel Products', 'Medical Equipment', 'Electronics Components', 'Building Materials']);
      }
    } catch (err) {
      console.error("Failed to fetch hero settings", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handlePopularSearch = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const features = heroContent?.features || [
    { title: 'Verified Sellers', desc: '100% Trusted & Verified' },
    { title: 'Quick Response', desc: 'Within 24 Hours' },
    { title: '24/7 Support', desc: 'Always Available' },
  ];

  // Helper to map index to icon/gradient
  const getFeatureIcon = (index) => {
    const icons = [BadgeCheck, Clock, HeadphonesIcon];
    const gradients = ['from-green-400 to-emerald-600', 'from-orange-400 to-red-600', 'from-purple-400 to-pink-600'];
    return { Icon: icons[index] || BadgeCheck, gradient: gradients[index] || 'from-blue-400 to-blue-600' };
  };

  return (
    <div className="relative min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-violet-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating gradient blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-48 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">{heroContent?.badge_text || "India's Most Trusted B2B Platform"}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {heroContent?.title_prefix || "Discover Thousands of"}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block mt-2 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent"
            >
              {heroContent?.title_highlight || "Trusted Suppliers"}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto"
          >
            {heroContent?.subtitle || "Connect with verified manufacturers, wholesalers, and service providers across India"}
          </motion.p>

          {/* Search Form with Glassmorphism */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onSubmit={handleSearch}
            className="mb-8"
          >
            <div className="relative max-w-3xl mx-auto group">
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-2xl blur-2xl opacity-50"
              />

              {/* Glassmorphism search bar */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-2 border border-white/20">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 w-full">
                    <Search className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search for products, services, or suppliers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-4 text-lg outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:w-auto flex-shrink-0 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Search
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.form>

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              <span className="text-white/80 text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending:
              </span>
              {popularSearches.map((term, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePopularSearch(term)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 text-sm font-medium"
                >
                  {term}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => {
              const { Icon, gradient } = getFeatureIcon(index);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 transition-all cursor-pointer"
                >
                  <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                  <p className="text-indigo-100 text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSearch;
