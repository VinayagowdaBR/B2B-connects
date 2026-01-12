import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, User, Building2, Heart, Bell, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { publicApi } from '@/api/endpoints/publicApi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const notificationRef = useRef(null);

  // Mock Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to B2BConnect!', time: 'Just now', unread: true },
    { id: 2, title: 'Your profile is 80% complete', time: '2 hours ago', unread: true },
    { id: 3, title: 'New inquiry received', time: '1 day ago', unread: false },
    { id: 4, title: 'Subscription active', time: '2 days ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await publicApi.getCategories();
        // Get first 6 categories for navbar display
        setCategories((data || []).slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to default categories
        setCategories([
          { id: 1, name: 'Building & Construction', slug: 'building-construction' },
          { id: 2, name: 'Electronics & Electrical', slug: 'electronics-electrical' },
          { id: 3, name: 'Industrial Machinery', slug: 'industrial-machinery' },
          { id: 4, name: 'Food & Agriculture', slug: 'food-agriculture' },
          { id: 5, name: 'Apparel & Garments', slug: 'apparel-garments' },
          { id: 6, name: 'Healthcare & Medical', slug: 'healthcare-medical' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/80 backdrop-blur-2xl shadow-xl shadow-gray-900/5 border-b border-gray-200/50'
        : 'bg-white/50 backdrop-blur-md border-b border-gray-100/50'
        }`}
    >
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white py-2.5 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between text-sm">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="font-medium">India's Fastest Growing B2B Marketplace</span>
            </motion.div>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/help" className="hover:text-indigo-200 transition-colors font-medium">Help</Link>
              <Link to="/become-seller" className="hover:text-indigo-200 transition-colors font-medium">Become a Seller</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl"
              />
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 p-2.5 rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow">
                <Building2 className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                B2BConnect
              </span>
              <span className="text-[10px] text-gray-500 -mt-1 font-medium">Trusted Business Network</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className={`hidden md:flex flex-1 max-w-2xl mx-8 transition-all duration-500 transform ${!isLandingPage || isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
            <div className="relative w-full group">
              {/* Search glow on focus */}
              <motion.div
                initial={{ opacity: 0 }}
                whileFocus={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl"
              />

              <div className="relative bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden group-hover:border-gray-300 focus-within:border-indigo-500 focus-within:bg-white transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search for products, services, or suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-3.5 outline-none text-sm bg-transparent text-gray-800 placeholder-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm"
                >
                  Search
                </motion.button>
              </div>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/wishlist">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>
            </Link>

            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${notification.unread ? 'bg-indigo-50/30' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-sm ${notification.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {notification.title}
                              </span>
                              {notification.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></span>}
                            </div>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 text-center bg-gray-50/50">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
                      >
                        View All Activity
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all font-medium"
            >
              <User className="w-4 h-4" />
              Login
            </Link>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 font-medium"
              >
                <Building2 className="w-4 h-4" />
                Register Business
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>



      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </form>

              {/* Mobile Categories */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.id || category.slug}
                    to={`/category/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all font-medium"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg transition-all font-medium"
                >
                  <Building2 className="w-4 h-4" />
                  Register Business
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
