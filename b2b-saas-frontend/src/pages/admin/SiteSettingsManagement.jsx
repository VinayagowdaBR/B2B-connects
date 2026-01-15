import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Settings, Phone, Mail, MapPin, Save, Plus, Trash2, Loader2,
    Facebook, Twitter, Linkedin, Instagram, Youtube,
    BarChart3, Link as LinkIcon, Info, Users, LayoutTemplate, HelpCircle, MessageCircle, Store
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
                { title: '', desc: '' }
            ]
        },
        help_center_content: {
            title: '',
            subtitle: '',
            search_placeholder: '',
            support_options: [],
            categories: []
        },
        become_seller_content: {
            hero: { badge: '', title_line1: '', title_highlight: '', subtitle: '', cta_primary: '', cta_secondary: '' },
            stats: [],
            benefits: { title: '', subtitle: '', items: [] },
            steps: { title: '', subtitle: '', items: [] },
            pricing: { title: '', subtitle: '', plans: [] },
            testimonials: { title: '', items: [] },
            cta_bottom: { title: '', subtitle: '', button_text: '', features: [] }
        }
    });

    const tabs = [
        { id: 'stats', label: 'Stats Counter', icon: BarChart3 },
        { id: 'hero', label: 'Hero Section', icon: LayoutTemplate },
        { id: 'seller', label: 'Become Seller', icon: Store },
        { id: 'help', label: 'Help Center', icon: HelpCircle },
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

    const updateHelpField = (field, value) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                [field]: value
            }
        }));
    };

    const updateHelpSupportOption = (index, key, value) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                support_options: (prev.help_center_content?.support_options || []).map((opt, i) =>
                    i === index ? { ...opt, [key]: value } : opt
                )
            }
        }));
    };

    const updateHelpCategory = (index, key, value) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                categories: (prev.help_center_content?.categories || []).map((cat, i) =>
                    i === index ? { ...cat, [key]: value } : cat
                )
            }
        }));
    };

    const addHelpCategory = () => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                categories: [
                    ...(prev.help_center_content?.categories || []),
                    {
                        name: 'New Category',
                        icon: 'HelpCircle',
                        color: 'from-gray-500 to-slate-500',
                        faqs: []
                    }
                ]
            }
        }));
    };

    const removeHelpCategory = (index) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                categories: (prev.help_center_content?.categories || []).filter((_, i) => i !== index)
            }
        }));
    };

    // Helper to update FAQs inside a category
    const updateHelpFaq = (catIndex, faqIndex, key, value) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                categories: (prev.help_center_content?.categories || []).map((cat, i) => {
                    if (i === catIndex) {
                        return {
                            ...cat,
                            faqs: (cat.faqs || []).map((faq, j) =>
                                j === faqIndex ? { ...faq, [key]: value } : faq
                            )
                        };
                    }
                    return cat;
                })
            }
        }));
    };

    const addHelpFaq = (catIndex) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                categories: (prev.help_center_content?.categories || []).map((cat, i) => {
                    if (i === catIndex) {
                        return {
                            ...cat,
                            faqs: [...(cat.faqs || []), { question: '', answer: '' }]
                        };
                    }
                    return cat;
                })
            }
        }));
    };

    const removeHelpFaq = (catIndex, faqIndex) => {
        setSettings(prev => ({
            ...prev,
            help_center_content: {
                ...prev.help_center_content,
                categories: (prev.help_center_content?.categories || []).map((cat, i) => {
                    if (i === catIndex) {
                        return {
                            ...cat,
                            faqs: (cat.faqs || []).filter((_, j) => j !== faqIndex)
                        };
                    }
                    return cat;
                })
            }
        }));
        const removeHelpFaq = (catIndex, faqIndex) => {
            setSettings(prev => ({
                ...prev,
                help_center_content: {
                    ...prev.help_center_content,
                    categories: (prev.help_center_content?.categories || []).map((cat, i) => {
                        if (i === catIndex) {
                            return {
                                ...cat,
                                faqs: (cat.faqs || []).filter((_, j) => j !== faqIndex)
                            };
                        }
                        return cat;
                    })
                }
            }));
        };

        // Helper for Become Seller Content
        const updateSellerSection = (section, key, value) => {
            setSettings(prev => ({
                ...prev,
                become_seller_content: {
                    ...prev.become_seller_content,
                    [section]: {
                        ...prev.become_seller_content?.[section],
                        [key]: value
                    }
                }
            }));
        };

        const updateSellerItem = (section, itemType, index, key, value) => {
            setSettings(prev => {
                const sectionData = prev.become_seller_content?.[section];
                let newContent;

                const updateItem = (item) => {
                    if (key === null) return value;
                    return { ...item, [key]: value };
                };

                if (Array.isArray(sectionData)) {
                    newContent = sectionData.map((item, i) => i === index ? updateItem(item) : item);
                } else {
                    newContent = {
                        ...sectionData,
                        [itemType]: (sectionData?.[itemType] || []).map((item, i) => i === index ? updateItem(item) : item)
                    };
                }

                return {
                    ...prev,
                    become_seller_content: {
                        ...prev.become_seller_content,
                        [section]: newContent
                    }
                };
            });
        };

        const addSellerItem = (section, itemType, defaultItem) => {
            setSettings(prev => {
                const sectionData = prev.become_seller_content?.[section];
                let newContent;

                if (Array.isArray(sectionData)) {
                    newContent = [...sectionData, defaultItem];
                } else {
                    newContent = {
                        ...sectionData,
                        [itemType]: [...(sectionData?.[itemType] || []), defaultItem]
                    };
                }

                return {
                    ...prev,
                    become_seller_content: {
                        ...prev.become_seller_content,
                        [section]: newContent
                    }
                };
            });
        };

        const removeSellerItem = (section, itemType, index) => {
            setSettings(prev => {
                const sectionData = prev.become_seller_content?.[section];
                let newContent;

                if (Array.isArray(sectionData)) {
                    newContent = sectionData.filter((_, i) => i !== index);
                } else {
                    newContent = {
                        ...sectionData,
                        [itemType]: (sectionData?.[itemType] || []).filter((_, i) => i !== index)
                    };
                }

                return {
                    ...prev,
                    become_seller_content: {
                        ...prev.become_seller_content,
                        [section]: newContent
                    }
                };
            });
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

                            {/* Become Seller Tab */}
                            {activeTab === 'seller' && (
                                <div className="space-y-8">
                                    {/* Hero Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Hero Section</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                                                <input type="text" value={settings.become_seller_content?.hero?.badge || ''} onChange={(e) => updateSellerSection('hero', 'badge', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title Line 1</label>
                                                <input type="text" value={settings.become_seller_content?.hero?.title_line1 || ''} onChange={(e) => updateSellerSection('hero', 'title_line1', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title Highlight</label>
                                                <input type="text" value={settings.become_seller_content?.hero?.title_highlight || ''} onChange={(e) => updateSellerSection('hero', 'title_highlight', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                                <input type="text" value={settings.become_seller_content?.hero?.subtitle || ''} onChange={(e) => updateSellerSection('hero', 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA</label>
                                                <input type="text" value={settings.become_seller_content?.hero?.cta_primary || ''} onChange={(e) => updateSellerSection('hero', 'cta_primary', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA</label>
                                                <input type="text" value={settings.become_seller_content?.hero?.cta_secondary || ''} onChange={(e) => updateSellerSection('hero', 'cta_secondary', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h3 className="text-lg font-medium text-gray-900">Stats</h3>
                                            <button onClick={() => addSellerItem('stats', null, { value: '', label: '' })} className="text-sm text-indigo-600 font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Stat</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {(settings.become_seller_content?.stats || []).map((stat, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg relative group border">
                                                    <button onClick={() => removeSellerItem('stats', null, index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="space-y-2">
                                                        <input type="text" placeholder="Value (e.g., 10K+)" value={stat.value} onChange={(e) => updateSellerItem('stats', null, index, 'value', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                                                        <input type="text" placeholder="Label" value={stat.label} onChange={(e) => updateSellerItem('stats', null, index, 'label', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Benefits Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
                                            <button onClick={() => addSellerItem('benefits', 'items', { title: '', desc: '', icon: 'Check', color: '' })} className="text-sm text-indigo-600 font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Benefit</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                    <input type="text" value={settings.become_seller_content?.benefits?.title || ''} onChange={(e) => updateSellerSection('benefits', 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                                    <input type="text" value={settings.become_seller_content?.benefits?.subtitle || ''} onChange={(e) => updateSellerSection('benefits', 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                            </div>
                                            {(settings.become_seller_content?.benefits?.items || []).map((item, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-lg relative group border">
                                                    <button onClick={() => removeSellerItem('benefits', 'items', index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateSellerItem('benefits', 'items', index, 'title', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm font-medium" />
                                                            <input type="text" placeholder="Icon Name" value={item.icon} onChange={(e) => updateSellerItem('benefits', 'items', index, 'icon', e.target.value)} className="w-1/3 px-2 py-1 border rounded text-sm" />
                                                        </div>
                                                        <textarea placeholder="Description" value={item.desc} onChange={(e) => updateSellerItem('benefits', 'items', index, 'desc', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" rows="2"></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Steps Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h3 className="text-lg font-medium text-gray-900">How It Works</h3>
                                            <button onClick={() => addSellerItem('steps', 'items', { number: '', title: '', desc: '', icon: 'Circle' })} className="text-sm text-indigo-600 font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Step</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                    <input type="text" value={settings.become_seller_content?.steps?.title || ''} onChange={(e) => updateSellerSection('steps', 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                                    <input type="text" value={settings.become_seller_content?.steps?.subtitle || ''} onChange={(e) => updateSellerSection('steps', 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                            </div>
                                            {(settings.become_seller_content?.steps?.items || []).map((item, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-lg relative group border">
                                                    <button onClick={() => removeSellerItem('steps', 'items', index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="No. (01)" value={item.number} onChange={(e) => updateSellerItem('steps', 'items', index, 'number', e.target.value)} className="w-16 px-2 py-1 border rounded text-sm font-bold" />
                                                            <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateSellerItem('steps', 'items', index, 'title', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm font-medium" />
                                                        </div>
                                                        <textarea placeholder="Description" value={item.desc} onChange={(e) => updateSellerItem('steps', 'items', index, 'desc', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" rows="2"></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h3 className="text-lg font-medium text-gray-900">Pricing Plans</h3>
                                            <button onClick={() => addSellerItem('pricing', 'plans', { name: '', price: '', period: '', desc: '', features: [], cta: '' })} className="text-sm text-indigo-600 font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Plan</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                    <input type="text" value={settings.become_seller_content?.pricing?.title || ''} onChange={(e) => updateSellerSection('pricing', 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                                    <input type="text" value={settings.become_seller_content?.pricing?.subtitle || ''} onChange={(e) => updateSellerSection('pricing', 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                            </div>
                                            {(settings.become_seller_content?.pricing?.plans || []).map((plan, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-lg relative group border">
                                                    <button onClick={() => removeSellerItem('pricing', 'plans', index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="Plan Name" value={plan.name} onChange={(e) => updateSellerItem('pricing', 'plans', index, 'name', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm font-bold" />
                                                            <input type="text" placeholder="Price" value={plan.price} onChange={(e) => updateSellerItem('pricing', 'plans', index, 'price', e.target.value)} className="w-1/4 px-2 py-1 border rounded text-sm" />
                                                            <input type="text" placeholder="Period" value={plan.period} onChange={(e) => updateSellerItem('pricing', 'plans', index, 'period', e.target.value)} className="w-1/4 px-2 py-1 border rounded text-sm" />
                                                        </div>
                                                        <input type="text" placeholder="CTA Text" value={plan.cta} onChange={(e) => updateSellerItem('pricing', 'plans', index, 'cta', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Testimonials Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h3 className="text-lg font-medium text-gray-900">Testimonials</h3>
                                            <button onClick={() => addSellerItem('testimonials', 'items', { name: '', company: '', location: '', quote: '', rating: 5 })} className="text-sm text-indigo-600 font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Testimonial</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                                <input type="text" value={settings.become_seller_content?.testimonials?.title || ''} onChange={(e) => updateSellerSection('testimonials', 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            {(settings.become_seller_content?.testimonials?.items || []).map((item, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-lg relative group border">
                                                    <button onClick={() => removeSellerItem('testimonials', 'items', index)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                    <div className="space-y-2">
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="Name" value={item.name} onChange={(e) => updateSellerItem('testimonials', 'items', index, 'name', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm font-medium" />
                                                            <input type="number" min="1" max="5" placeholder="Rating" value={item.rating} onChange={(e) => updateSellerItem('testimonials', 'items', index, 'rating', parseInt(e.target.value))} className="w-16 px-2 py-1 border rounded text-sm" />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="Company" value={item.company} onChange={(e) => updateSellerItem('testimonials', 'items', index, 'company', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" />
                                                            <input type="text" placeholder="Location" value={item.location} onChange={(e) => updateSellerItem('testimonials', 'items', index, 'location', e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" />
                                                        </div>
                                                        <textarea placeholder="Quote" value={item.quote} onChange={(e) => updateSellerItem('testimonials', 'items', index, 'quote', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" rows="2"></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Call to Action (CTA) Section */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b pb-2">
                                            <h3 className="text-lg font-medium text-gray-900">Bottom CTA</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                    <input type="text" value={settings.become_seller_content?.cta_bottom?.title || ''} onChange={(e) => updateSellerSection('cta_bottom', 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                                    <input type="text" value={settings.become_seller_content?.cta_bottom?.subtitle || ''} onChange={(e) => updateSellerSection('cta_bottom', 'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                                    <input type="text" value={settings.become_seller_content?.cta_bottom?.button_text || ''} onChange={(e) => updateSellerSection('cta_bottom', 'button_text', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">Features List</label>
                                                    <button onClick={() => addSellerItem('cta_bottom', 'features', '')} className="text-xs text-indigo-600 font-medium flex items-center gap-1"><Plus className="w-3 h-3" /> Add Feature</button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                    {(settings.become_seller_content?.cta_bottom?.features || []).map((feature, index) => (
                                                        <div key={index} className="relative group">
                                                            <input
                                                                type="text"
                                                                value={feature}
                                                                onChange={(e) => updateSellerItem('cta_bottom', 'features', index, null, e.target.value)}
                                                                className="w-full px-2 py-1.5 border rounded text-sm pr-6"
                                                                placeholder="Feature text"
                                                            />
                                                            <button onClick={() => removeSellerItem('cta_bottom', 'features', index)} className="absolute top-1.5 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Help Center Tab */}
                            {activeTab === 'help' && (
                                <div className="space-y-8">
                                    {/* General Settings */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                                            <input
                                                type="text"
                                                value={settings.help_center_content?.title || ''}
                                                onChange={(e) => updateHelpField('title', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                                placeholder="How Can We Help?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                                            <input
                                                type="text"
                                                value={settings.help_center_content?.subtitle || ''}
                                                onChange={(e) => updateHelpField('subtitle', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Find answers to common questions..."
                                            />
                                        </div>
                                    </div>

                                    {/* Support Options */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Support Options</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {(settings.help_center_content?.support_options || []).map((option, index) => (
                                                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                                            <input
                                                                type="text"
                                                                value={option.title}
                                                                onChange={(e) => updateHelpSupportOption(index, 'title', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Action Text</label>
                                                            <input
                                                                type="text"
                                                                value={option.action}
                                                                onChange={(e) => updateHelpSupportOption(index, 'action', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                                                            <input
                                                                type="text"
                                                                value={option.description}
                                                                onChange={(e) => updateHelpSupportOption(index, 'description', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Link (mailto: or tel:)</label>
                                                            <input
                                                                type="text"
                                                                value={option.link}
                                                                onChange={(e) => updateHelpSupportOption(index, 'link', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* FAQ Categories */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">FAQ Categories</h3>
                                            <button
                                                onClick={addHelpCategory}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100"
                                            >
                                                <Plus className="h-4 w-4" /> Add Category
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            {(settings.help_center_content?.categories || []).map((category, catIndex) => (
                                                <div key={catIndex} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm relative group">
                                                    <button
                                                        onClick={() => removeHelpCategory(catIndex)}
                                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-md hover:bg-red-50"
                                                        title="Remove Category"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="flex items-center gap-4 mb-6 pr-8">
                                                        <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl text-white`}>
                                                            <HelpCircle className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Category Name</label>
                                                            <input
                                                                type="text"
                                                                value={category.name}
                                                                onChange={(e) => updateHelpCategory(catIndex, 'name', e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* FAQs in Category */}
                                                    <div className="pl-4 border-l-2 border-gray-100 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium text-gray-700">Questions & Answers</h4>
                                                            <button
                                                                onClick={() => addHelpFaq(catIndex)}
                                                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                                                            >
                                                                <Plus className="w-3 h-3" /> Add Question
                                                            </button>
                                                        </div>

                                                        {(category.faqs || []).map((faq, faqIndex) => (
                                                            <div key={faqIndex} className="bg-gray-50 p-4 rounded-lg relative group">
                                                                <button
                                                                    onClick={() => removeHelpFaq(catIndex, faqIndex)}
                                                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                <div className="space-y-3">
                                                                    <input
                                                                        type="text"
                                                                        value={faq.question}
                                                                        onChange={(e) => updateHelpFaq(catIndex, faqIndex, 'question', e.target.value)}
                                                                        placeholder="Question"
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium"
                                                                    />
                                                                    <textarea
                                                                        rows="2"
                                                                        value={faq.answer}
                                                                        onChange={(e) => updateHelpFaq(catIndex, faqIndex, 'answer', e.target.value)}
                                                                        placeholder="Answer"
                                                                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
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
};

export default SiteSettingsManagement;
