import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, MapPin, Loader2, Package, Heart, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { publicApi } from '@/api/endpoints/publicApi';

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const demoProducts = [
    { id: 1, name: 'Industrial CNC Machine', image: null, price: '₹5,50,000', price_unit: 'per unit', business: 'Tech Machinery Ltd', location: 'Mumbai', rating: 4.7, category: 'Machinery' },
    { id: 2, name: 'Stainless Steel Pipes', image: null, price: '₹450', price_unit: 'per kg', business: 'Steel Industries', location: 'Pune', rating: 4.5, category: 'Steel' },
    { id: 3, name: 'Organic Rice (Bulk)', image: null, price: '₹65', price_unit: 'per kg', business: 'Agro Fresh Foods', location: 'Chennai', rating: 4.8, category: 'Agriculture' },
    { id: 4, name: 'Digital Blood Pressure Monitor', image: null, price: '₹2,500', price_unit: 'per unit', business: 'Medical Equipments Co', location: 'Delhi', rating: 4.6, category: 'Medical' },
    { id: 5, name: 'Cotton Fabric Roll', image: null, price: '₹180', price_unit: 'per meter', business: 'Fashion Textile Hub', location: 'Bangalore', rating: 4.4, category: 'Textile' },
    { id: 6, name: 'Cement (OPC 53 Grade)', image: null, price: '₹380', price_unit: 'per bag', business: 'BuildRight Materials', location: 'Hyderabad', rating: 4.7, category: 'Construction' },
    { id: 7, name: 'Solar Panel 400W', image: null, price: '₹18,000', price_unit: 'per unit', business: 'Green Energy Solutions', location: 'Ahmedabad', rating: 4.8, category: 'Energy' },
    { id: 8, name: 'Packaging Boxes (Bulk)', image: null, price: '₹12', price_unit: 'per piece', business: 'Pack Solutions', location: 'Kolkata', rating: 4.3, category: 'Packaging' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await publicApi.getProducts(0, 8);
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(demoProducts);
        }
      } catch (err) {
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
      transition: { staggerChildren: 0.08 },
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
    <section ref={ref} className="bg-white py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-orange-600 text-sm font-semibold">Fresh Arrivals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover trending products from verified suppliers
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {products.map((product, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -12 }}
              className="group"
            >
              <Link
                to={`/product/${product.id}`}
                className="block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                {/* Image Container with Parallax Effect */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {product.image ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-20 h-20 text-gray-300" />
                    </div>
                  )}

                  {/* Overlay with Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Category Badge with Glassmorphism */}
                  {product.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-600 shadow-lg">
                      {product.category}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Price with Emphasis */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.price_unit || 'per unit'}
                    </span>
                  </div>

                  {/* Business Info */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="line-clamp-1">{product.business}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {product.rating || 4.5}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">rating</span>
                  </div>
                </div>

                {/* Hover Glow Border Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500 ring-opacity-50 blur-sm" />
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
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsGrid;
