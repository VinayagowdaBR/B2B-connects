import { Link } from 'react-router-dom';
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube
} from 'lucide-react';

const Footer = () => {
    const categories = [
        'Building & Construction',
        'Electronics & Electrical',
        'Healthcare & Medical',
        'Food & Agriculture',
        'Industrial Machinery',
        'Apparel & Garments',
    ];

    const quickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
    ];

    const support = [
        { name: 'Help Center', href: '/help' },
        { name: 'FAQs', href: '/faq' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Refund Policy', href: '/refund-policy' },
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <Building2 className="h-8 w-8 text-blue-500" />
                            <span className="text-xl font-bold text-white">B2B<span className="text-blue-500">Connect</span></span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-md">
                            India's leading B2B marketplace connecting buyers with verified suppliers.
                            Discover thousands of products and services for your business needs.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-500" />
                                <a href="mailto:support@b2bconnect.com" className="hover:text-white transition-colors">
                                    support@b2bconnect.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-500" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                                    +91 98765 43210
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <span>Bangalore, Karnataka, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link
                                        to={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                        className="hover:text-white transition-colors text-sm"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="hover:text-white transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} B2BConnect. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                                    >
                                        <IconComponent className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
