import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { customerCompanyInfoApi } from '@/api/endpoints/customer/companyInfo';
import {
    Building2,
    Globe,
    Mail,
    Phone,
    MapPin,
    Save,
    Camera,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Link as LinkIcon,
    FileText,
    Clock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerCompanyInfo = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [companyData, setCompanyData] = useState({
        company_name: '',
        tagline: '',
        description: '',
        logo_url: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        facebook_url: '',
        twitter_url: '',
        linkedin_url: '',
        instagram_url: '',
        youtube_url: '',
        founding_year: '',
        industry: '',
        company_size: '',
    });

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    const fetchCompanyInfo = async () => {
        try {
            setIsLoading(true);
            const data = await customerCompanyInfoApi.getMyCompanyInfo();
            if (data) {
                setCompanyData((prev) => ({ ...prev, ...data }));
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error('Error fetching company info:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            if (companyData.id) {
                await customerCompanyInfoApi.updateMyCompanyInfo(companyData);
            } else {
                await customerCompanyInfoApi.createCompanyInfo(companyData);
            }
            toast.success('Company information saved successfully!');
            fetchCompanyInfo();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to save company information');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <CustomerLayout title="Company Info" subtitle="Loading...">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout title="Company Info" subtitle="Manage your business details">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Logo & Preview */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Company Logo</h3>

                            {/* Logo Preview */}
                            <div className="relative mb-4">
                                {companyData.logo_url ? (
                                    <img
                                        src={companyData.logo_url}
                                        alt="Company Logo"
                                        className="w-32 h-32 object-cover rounded-xl mx-auto border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto">
                                        <Building2 className="w-16 h-16 text-white" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <Camera className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="mt-8">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo URL
                                </label>
                                <input
                                    type="url"
                                    name="logo_url"
                                    value={companyData.logo_url}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            {/* Quick Stats */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Profile Completion</h4>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                                        style={{ width: `${Math.min(Object.values(companyData).filter(Boolean).length * 5, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {Object.values(companyData).filter(Boolean).length} of 20 fields completed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Building2 className="w-5 h-5 mr-2 text-teal-500" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="company_name"
                                        value={companyData.company_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Your Company Name"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        name="tagline"
                                        value={companyData.tagline}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Your company tagline or slogan"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={companyData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                                        placeholder="Describe your company, services, and what makes you unique..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Industry
                                    </label>
                                    <select
                                        name="industry"
                                        value={companyData.industry}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="">Select Industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="finance">Finance</option>
                                        <option value="education">Education</option>
                                        <option value="retail">Retail</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="construction">Construction</option>
                                        <option value="real_estate">Real Estate</option>
                                        <option value="hospitality">Hospitality</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Size
                                    </label>
                                    <select
                                        name="company_size"
                                        value={companyData.company_size}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="">Select Size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Founding Year
                                    </label>
                                    <input
                                        type="number"
                                        name="founding_year"
                                        value={companyData.founding_year}
                                        onChange={handleChange}
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="2020"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-teal-500" />
                                Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Globe className="w-4 h-4 inline mr-1" />
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={companyData.website}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="https://yourcompany.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={companyData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="contact@yourcompany.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={companyData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-teal-500" />
                                Address
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={companyData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="123 Business Street"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={companyData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={companyData.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Maharashtra"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={companyData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="India"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP/Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zip_code"
                                        value={companyData.zip_code}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="400001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <LinkIcon className="w-5 h-5 mr-2 text-teal-500" />
                                Social Links
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Facebook className="w-4 h-4 inline mr-1 text-blue-600" />
                                        Facebook
                                    </label>
                                    <input
                                        type="url"
                                        name="facebook_url"
                                        value={companyData.facebook_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="https://facebook.com/yourpage"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Twitter className="w-4 h-4 inline mr-1 text-sky-500" />
                                        Twitter / X
                                    </label>
                                    <input
                                        type="url"
                                        name="twitter_url"
                                        value={companyData.twitter_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="https://twitter.com/yourhandle"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Linkedin className="w-4 h-4 inline mr-1 text-blue-700" />
                                        LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin_url"
                                        value={companyData.linkedin_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="https://linkedin.com/company/yourcompany"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                                        Instagram
                                    </label>
                                    <input
                                        type="url"
                                        name="instagram_url"
                                        value={companyData.instagram_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="https://instagram.com/yourhandle"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Youtube className="w-4 h-4 inline mr-1 text-red-600" />
                                        YouTube
                                    </label>
                                    <input
                                        type="url"
                                        name="youtube_url"
                                        value={companyData.youtube_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="https://youtube.com/@yourchannel"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {isSaving ? 'Saving...' : 'Save Company Info'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </CustomerLayout>
    );
};

export default CustomerCompanyInfo;
