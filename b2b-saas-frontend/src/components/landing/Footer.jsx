import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { publicApi } from '@/api/endpoints/publicApi';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, categoriesData] = await Promise.all([
          publicApi.getSiteSettings(),
          publicApi.getCategories()
        ]);
        setSettings(settingsData);
        setCategories(categoriesData?.slice(0, 6) || []);
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    };
    fetchData();
  }, []);

  // Use settings or defaults
  const contactEmail = settings?.contact_email || 'support@b2bconnect.com';
  const contactPhone = settings?.contact_phone || '+91 123 456 7890';
  const contactAddress = settings?.contact_address || 'Mumbai, Maharashtra, India';
  const quickLinks = settings?.quick_links || [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ];
  const supportLinks = settings?.support_links || [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund-policy' },
  ];

  const socialLinks = [
    { icon: Facebook, href: settings?.facebook_url, label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Twitter, href: settings?.twitter_url, label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Linkedin, href: settings?.linkedin_url, label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Instagram, href: settings?.instagram_url, label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Youtube, href: settings?.youtube_url, label: 'YouTube', color: 'hover:text-red-500' },
  ].filter(s => s.href);

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-20 pb-10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-2xl shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">B2BConnect</span>
                <span className="text-[10px] text-gray-400 -mt-1">Trusted Business Network</span>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed">
              India's most trusted B2B marketplace connecting verified suppliers with genuine buyers across all industries.
            </p>

            {/* Contact Info - Dynamic */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Phone className="w-4 h-4 text-indigo-400" />
                </div>
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  {contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                </div>
                <span>{contactAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Dynamic */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Categories - Dynamic from API */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              {categories.length > 0 ? categories.map((category, index) => (
                <motion.li
                  key={category.id || index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/category/${category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </motion.li>
              )) : (
                ['Building & Construction', 'Electronics & Electrical', 'Healthcare & Medical', 'Food & Agriculture', 'Industrial Machinery', 'Apparel & Garments'].map((cat, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link to={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {cat}
                    </Link>
                  </motion.li>
                ))
              )}
            </ul>
          </div>

          {/* Support - Dynamic */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white font-bold text-2xl mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">Subscribe to our newsletter for latest updates and exclusive offers</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} B2BConnect. Made with <Heart className="inline w-4 h-4 text-red-500 fill-red-500" /> in India. All rights reserved.
            </p>

            {/* Social Links - Dynamic */}
            <div className="flex items-center gap-4">
              {socialLinks.length > 0 ? socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-colors`}
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              }) : (
                [Facebook, Twitter, Linkedin, Instagram, Youtube].map((IconComponent, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
