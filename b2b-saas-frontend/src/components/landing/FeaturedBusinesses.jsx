import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, ArrowRight, Building2, Loader2, Package, Briefcase, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { publicApi } from '@/api/endpoints/publicApi';

const FeaturedBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const demoBusinesses = [
    { id: 1, tenant_id: 1, slug: 'tech-solutions-pvt-ltd', name: 'Tech Solutions Pvt Ltd', logo: null, category: 'IT Services', location: 'Bangalore, Karnataka', rating: 4.8, reviews: 156, is_verified: true, products: 45, services: 12, description: 'Leading provider of enterprise software solutions and IT consulting services.' },
    { id: 2, tenant_id: 2, slug: 'steel-industries', name: 'Steel Industries', logo: null, category: 'Manufacturing', location: 'Mumbai, Maharashtra', rating: 4.6, reviews: 89, is_verified: true, products: 120, services: 5, description: 'Premium quality steel products for construction and industrial applications.' },
    { id: 3, tenant_id: 3, slug: 'agro-fresh-foods', name: 'Agro Fresh Foods', logo: null, category: 'Food & Agriculture', location: 'Pune, Maharashtra', rating: 4.9, reviews: 234, is_verified: true, products: 78, services: 3, description: 'Organic food products and agricultural supplies for wholesale buyers.' },
    { id: 4, tenant_id: 4, slug: 'medical-equipments-co', name: 'Medical Equipments Co', logo: null, category: 'Healthcare', location: 'Chennai, Tamil Nadu', rating: 4.7, reviews: 112, is_verified: true, products: 65, services: 8, description: 'High-quality medical devices and hospital equipment supplier.' },
    { id: 5, tenant_id: 5, slug: 'fashion-textile-hub', name: 'Fashion Textile Hub', logo: null, category: 'Apparel', location: 'Delhi, NCR', rating: 4.5, reviews: 198, is_verified: false, products: 250, services: 2, description: 'Wholesale textiles and fashion garments for retail businesses.' },
    { id: 6, tenant_id: 6, slug: 'buildright-materials', name: 'BuildRight Materials', logo: null, category: 'Construction', location: 'Hyderabad, Telangana', rating: 4.8, reviews: 145, is_verified: true, products: 90, services: 6, description: 'Complete range of building and construction materials.' },
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getBusinesses(0, 6);
        if (data && data.length > 0) {
          setBusinesses(data);
        } else {
          setBusinesses(demoBusinesses);
        }
      } catch (err) {
        setBusinesses(demoBusinesses);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section ref={ref} className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-6">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-green-600 text-sm font-semibold">Top Rated</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Businesses
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with verified and trusted suppliers across India
          </p>
        </motion.div>

        {/* Businesses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {businesses.map((business, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link
                to={`/business/${business.slug}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className="relative h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 overflow-hidden">
                  {/* Animated pattern */}
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      backgroundSize: '30px 30px',
                    }}
                  />

                  {/* Verified Badge */}
                  {business.is_verified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="absolute top-4 right-4 bg-white text-green-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg"
                    >
                      <BadgeCheck className="w-4 h-4" />
                      Verified
                    </motion.div>
                  )}
                </div>

                {/* Logo */}
                <div className="relative px-6 -mt-12">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden"
                  >
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-indigo-600" />
                    )}
                  </motion.div>
                </div>

                {/* Info */}
                <div className="px-6 pt-4 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {business.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                      {business.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{business.location}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {business.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-900">{business.products || 0}</span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Products</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        <span className="text-2xl font-bold text-gray-900">{business.services || 0}</span>
                      </div>
                      <span className="text-xs text-gray-600 font-medium">Services</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(business.rating || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-gray-900 ml-2">
                        {business.rating || 4.5}
                      </span>
                      <span className="text-sm text-gray-500">({business.reviews || 0})</span>
                    </div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-1 text-indigo-600 font-semibold text-sm"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/businesses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Businesses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
