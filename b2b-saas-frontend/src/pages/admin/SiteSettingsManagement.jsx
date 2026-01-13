import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Settings, Phone, Mail, MapPin, Save, Plus, Trash2, Loader2,
    Facebook, Twitter, Linkedin, Instagram, Youtube,
    BarChart3, Link as LinkIcon, Info, Users, LayoutTemplate
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { siteSettingsApi } from '@/api/endpoints/siteSettings';

const SiteSettingsManagement = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('stats');
    const [settings, setSettings] = useState({
        contact_email: 'support@b2bconnect.com',
        contact_phone: '+91 123 456 7890',
        contact_address: 'Mumbai, Maharashtra, India',
        facebook_url: '',
        twitter_url: '',
        linkedin_url: '',
        instagram_url: '',
        youtube_url: '',
        stats_buyers: 50000,
        stats_sellers: 10000,
        stats_products: 100000,
        stats_inquiries: 25000,
        quick_links: [
            { name: 'About Us', href: '/about' },
            { name: 'Contact Us', href: '/contact' },
            { name: 'How It Works', href: '/how-it-works' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Blog', href: '/blog' },
            { name: 'Careers', href: '/careers' }
        ],
        support_links: [
            { name: 'Help Center', href: '/help' },
            { name: 'FAQs', href: '/faq' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Refund Policy', href: '/refund-policy' }
        ],
        about_us_content: {
            title: '',
            description: '',
            mission: '',
            vision: '',
            values: [],
            hero_image_url: '',
            team_image_url: ''
        },
        hero_content: {
            badge_text: '',
            title_prefix: '',
            title_highlight: '',
            subtitle: '',
            popular_searches: [],
            features: [
                { title: '', desc: '' },
                { title: '', desc: '' },
                { title: '', desc: '' }
            ]
        }
    });

    const tabs = [
        { id: 'stats', label: 'Stats Counter', icon: BarChart3 },
        { id: 'hero', label: 'Hero Section', icon: LayoutTemplate },
        { id: 'about', label: 'About Us', icon: Info },
        { id: 'contact', label: 'Contact Info', icon: Phone },
        { id: 'social', label: 'Social Links', icon: Facebook },
        { id: 'links', label: 'Footer Links', icon: LinkIcon },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await siteSettingsApi.getSiteSettings();
            setSettings(data);
        } catch (err) {
            console.error('Error fetching settings:', err);
            toast.error('Using default settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await siteSettingsApi.updateSiteSettings(settings);
            toast.success('Settings saved successfully!');
        } catch (err) {
            console.error('Error saving settings:', err);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const updateAboutField = (field, value) => {
        setSettings(prev => ({
            ...prev,
            about_us_content: {
                ...prev.about_us_content,
                [field]: value
            }
        }));
    };

    const updateAboutValues = (value) => {
        // value is a comma-separated string
        const valuesArray = value.split(',').map(v => v.trim()).filter(Boolean);
        updateAboutField('values', valuesArray);
    };

    const addLink = (type) => {
        const field = type === 'quick' ? 'quick_links' : 'support_links';
        setSettings(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), { name: '', href: '' }]
        }));
    };

    const removeLink = (type, index) => {
        const field = type === 'quick' ? 'quick_links' : 'support_links';
        setSettings(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, i) => i !== index)
        }));
    };

    const updateLink = (type, index, key, value) => {
        const field = type === 'quick' ? 'quick_links' : 'support_links';
        setSettings(prev => ({
            ...prev,
            [field]: (prev[field] || []).map((link, i) =>
                i === index ? { ...link, [key]: value } : link
            )
        }));
    };

    const updateHeroField = (field, value) => {
        setSettings(prev => ({
            ...prev,
            hero_content: {
                ...prev.hero_content,
                [field]: value
            }
        }));
    };

    const updateHeroPopularSearches = (value) => {
        const valuesArray = value.split(',').map(v => v.trim()).filter(Boolean);
        updateHeroField('popular_searches', valuesArray);
    };

    const updateHeroFeature = (index, key, value) => {
        setSettings(prev => ({
            ...prev,
            hero_content: {
                ...prev.hero_content,
                features: (prev.hero_content?.features || []).map((feat, i) =>
                    i === index ? { ...feat, [key]: value } : feat
                )
            }
        }));
    };

    const headerActions = (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
    );

    if (loading) {
        return (
            <AdminLayout title="Site Settings" subtitle="Loading...">
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Site Settings"
            subtitle="Manage Stats Counter and Footer content"
            headerActions={headerActions}
        >
            <div className="space-y-6">

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Stats Counter Tab */}
                        {activeTab === 'stats' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Registered Buyers</label>
                                        <input
                                            type="number"
                                            value={settings.stats_buyers}
                                            onChange={(e) => updateField('stats_buyers', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Displays as: {(settings.stats_buyers / 1000).toFixed(0)}K+</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Verified Sellers</label>
                                        <input
                                            type="number"
                                            value={settings.stats_sellers}
                                            onChange={(e) => updateField('stats_sellers', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Displays as: {(settings.stats_sellers / 1000).toFixed(0)}K+</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Products Listed</label>
                                        <input
                                            type="number"
                                            value={settings.stats_products}
                                            onChange={(e) => updateField('stats_products', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Displays as: {(settings.stats_products / 100000).toFixed(1)}L+</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Daily Inquiries</label>
                                        <input
                                            type="number"
                                            value={settings.stats_inquiries}
                                            onChange={(e) => updateField('stats_inquiries', parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Displays as: {(settings.stats_inquiries / 1000).toFixed(0)}K+</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hero Section Tab */}
                        {activeTab === 'hero' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                                            <input
                                                type="text"
                                                value={settings.hero_content?.badge_text || ''}
                                                onChange={(e) => updateHeroField('badge_text', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g., India's Most Trusted B2B Platform"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Popular Searches (Comma separated)</label>
                                            <input
                                                type="text"
                                                value={(settings.hero_content?.popular_searches || []).join(', ')}
                                                onChange={(e) => updateHeroPopularSearches(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g., Steel, Cement, Machinery"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title Prefix</label>
                                            <input
                                                type="text"
                                                value={settings.hero_content?.title_prefix || ''}
                                                onChange={(e) => updateHeroField('title_prefix', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g., Discover Thousands of"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title Highlight</label>
                                            <input
                                                type="text"
                                                value={settings.hero_content?.title_highlight || ''}
                                                onChange={(e) => updateHeroField('title_highlight', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="e.g., Trusted Suppliers"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                                        <textarea
                                            rows="2"
                                            value={settings.hero_content?.subtitle || ''}
                                            onChange={(e) => updateHeroField('subtitle', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="e.g., Connect with..."
                                        />
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Features</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {(settings.hero_content?.features || []).map((feature, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Feature {index + 1} Title</label>
                                                        <input
                                                            type="text"
                                                            value={feature.title}
                                                            onChange={(e) => updateHeroFeature(index, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                        <input
                                                            type="text"
                                                            value={feature.desc}
                                                            onChange={(e) => updateHeroFeature(index, 'desc', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* About Us Tab */}
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                                        <input
                                            type="text"
                                            value={settings.about_us_content?.title || ''}
                                            onChange={(e) => updateAboutField('title', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="e.g., About Us"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
                                        <textarea
                                            rows="4"
                                            value={settings.about_us_content?.description || ''}
                                            onChange={(e) => updateAboutField('description', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter main description..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                                            <textarea
                                                rows="3"
                                                value={settings.about_us_content?.mission || ''}
                                                onChange={(e) => updateAboutField('mission', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Our mission is..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
                                            <textarea
                                                rows="3"
                                                value={settings.about_us_content?.vision || ''}
                                                onChange={(e) => updateAboutField('vision', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Our vision is..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Values (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={(settings.about_us_content?.values || []).join(', ')}
                                            onChange={(e) => updateAboutValues(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Integrity, Innovation, Growth"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                                            <input
                                                type="url"
                                                value={settings.about_us_content?.hero_image_url || ''}
                                                onChange={(e) => updateAboutField('hero_image_url', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Team Image URL</label>
                                            <input
                                                type="url"
                                                value={settings.about_us_content?.team_image_url || ''}
                                                onChange={(e) => updateAboutField('team_image_url', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Info Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="inline h-4 w-4 mr-1" /> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.contact_email}
                                            onChange={(e) => updateField('contact_email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="inline h-4 w-4 mr-1" /> Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.contact_phone}
                                            onChange={(e) => updateField('contact_phone', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="inline h-4 w-4 mr-1" /> Address
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.contact_address}
                                        onChange={(e) => updateField('contact_address', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Social Links Tab */}
                        {activeTab === 'social' && (
                            <div className="space-y-4">
                                {[
                                    { key: 'facebook_url', icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
                                    { key: 'twitter_url', icon: Twitter, label: 'Twitter / X', color: 'text-sky-500' },
                                    { key: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
                                    { key: 'instagram_url', icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
                                    { key: 'youtube_url', icon: Youtube, label: 'YouTube', color: 'text-red-600' },
                                ].map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <div key={social.key} className="flex items-center gap-4">
                                            <div className={`p-3 bg-gray-100 rounded-xl ${social.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="url"
                                                value={settings[social.key] || ''}
                                                onChange={(e) => updateField(social.key, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder={`https://${social.label.toLowerCase().replace(' / x', '')}.com/your-page`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer Links Tab */}
                        {activeTab === 'links' && (
                            <div className="space-y-8">
                                {/* Quick Links */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
                                        <button
                                            onClick={() => addLink('quick')}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100"
                                        >
                                            <Plus className="h-4 w-4" /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(settings.quick_links || []).map((link, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={link.name}
                                                    onChange={(e) => updateLink('quick', index, 'name', e.target.value)}
                                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
                                                    placeholder="Link Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.href}
                                                    onChange={(e) => updateLink('quick', index, 'href', e.target.value)}
                                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
                                                    placeholder="/path"
                                                />
                                                <button onClick={() => removeLink('quick', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Support Links */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Support Links</h3>
                                        <button
                                            onClick={() => addLink('support')}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100"
                                        >
                                            <Plus className="h-4 w-4" /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {(settings.support_links || []).map((link, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={link.name}
                                                    onChange={(e) => updateLink('support', index, 'name', e.target.value)}
                                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
                                                    placeholder="Link Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.href}
                                                    onChange={(e) => updateLink('support', index, 'href', e.target.value)}
                                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg"
                                                    placeholder="/path"
                                                />
                                                <button onClick={() => removeLink('support', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SiteSettingsManagement;
