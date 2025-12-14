import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Cpu, Stethoscope, Wheat, Shirt, Package,
  Truck, Factory, Wrench, FlaskConical, Utensils, Gem,
  Loader2, Grid3X3, ArrowRight, Sparkles, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { publicApi } from '@/api/endpoints/publicApi';

const iconMap = {
  Building2, Cpu, Stethoscope, Wheat, Shirt, Package,
  Truck, Factory, Wrench, FlaskConical, Utensils, Gem, Grid3X3
};

const colorVariants = {
  'bg-orange-500': { gradient: 'from-orange-500 to-orange-600', light: 'from-orange-50 to-orange-100', text: 'text-orange-600', shadow: 'shadow-orange-500/30' },
  'bg-blue-500': { gradient: 'from-blue-500 to-blue-600', light: 'from-blue-50 to-blue-100', text: 'text-blue-600', shadow: 'shadow-blue-500/30' },
  'bg-green-500': { gradient: 'from-green-500 to-emerald-600', light: 'from-green-50 to-emerald-100', text: 'text-green-600', shadow: 'shadow-green-500/30' },
  'bg-yellow-500': { gradient: 'from-yellow-500 to-amber-600', light: 'from-yellow-50 to-amber-100', text: 'text-yellow-600', shadow: 'shadow-yellow-500/30' },
  'bg-pink-500': { gradient: 'from-pink-500 to-rose-600', light: 'from-pink-50 to-rose-100', text: 'text-pink-600', shadow: 'shadow-pink-500/30' },
  'bg-purple-500': { gradient: 'from-purple-500 to-violet-600', light: 'from-purple-50 to-violet-100', text: 'text-purple-600', shadow: 'shadow-purple-500/30' },
  'bg-gray-600': { gradient: 'from-gray-600 to-gray-700', light: 'from-gray-50 to-gray-100', text: 'text-gray-600', shadow: 'shadow-gray-500/30' },
  'bg-indigo-500': { gradient: 'from-indigo-500 to-indigo-600', light: 'from-indigo-50 to-indigo-100', text: 'text-indigo-600', shadow: 'shadow-indigo-500/30' },
  'bg-red-500': { gradient: 'from-red-500 to-red-600', light: 'from-red-50 to-red-100', text: 'text-red-600', shadow: 'shadow-red-500/30' },
  'bg-teal-500': { gradient: 'from-teal-500 to-teal-600', light: 'from-teal-50 to-teal-100', text: 'text-teal-600', shadow: 'shadow-teal-500/30' },
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const defaultCategories = [
    { name: 'Building & Construction', slug: 'building-construction', icon: 'Building2', color: 'bg-orange-500', count: 5420 },
    { name: 'Electronics & Electrical', slug: 'electronics-electrical', icon: 'Cpu', color: 'bg-blue-500', count: 8930 },
    { name: 'Healthcare & Medical', slug: 'healthcare-medical', icon: 'Stethoscope', color: 'bg-green-500', count: 3210 },
    { name: 'Food & Agriculture', slug: 'food-agriculture', icon: 'Wheat', color: 'bg-yellow-500', count: 6780 },
    { name: 'Apparel & Garments', slug: 'apparel-garments', icon: 'Shirt', color: 'bg-pink-500', count: 4560 },
    { name: 'Packaging & Supplies', slug: 'packaging-supplies', icon: 'Package', color: 'bg-purple-500', count: 2340 },
    { name: 'Industrial Machinery', slug: 'industrial-machinery', icon: 'Factory', color: 'bg-gray-600', count: 7890 },
    { name: 'Transportation', slug: 'transportation-logistics', icon: 'Truck', color: 'bg-indigo-500', count: 1920 },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(defaultCategories);
        }
      } catch (err) {
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const formatCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
    return `${count}+`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 py-24">
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
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={ref} className="relative bg-gradient-to-b from-white via-gray-50 to-white py-24 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-600 text-sm font-semibold">Explore Industries</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore thousands of products and services across various industries
          </p>
        </motion.div>

        {/* Bento-Style Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {categories.slice(0, 8).map((category, index) => {
            const IconComponent = iconMap[category.icon] || Grid3X3;
            const colors = colorVariants[category.color] || colorVariants['bg-blue-500'];
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative block bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent transition-all duration-300 overflow-hidden"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Gradient Background on Hover - Glassmorphism */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Subtle light effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with animated background */}
                    <div className="relative mb-4 inline-block">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`inline-flex p-3 md:p-4 bg-gradient-to-br ${colors.light} rounded-2xl group-hover:bg-white/20 transition-colors shadow-sm`}
                      >
                        <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${colors.text} group-hover:text-white transition-colors`} />
                      </motion.div>
                    </div>
                    
                    {/* Category Name */}
                    <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-white mb-2 transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                    
                    {/* Count with icon */}
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {formatCount(category.count || 0)} listings
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute bottom-4 right-4 md:bottom-6 md:right-6"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Decorative Circle */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Categories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
