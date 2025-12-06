import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Settings, Bell, Lock, Trash2, Download, Shield, Moon, Sun, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        inquiryAlerts: true,
        weeklyReport: false,
        marketingEmails: false,
        twoFactorAuth: false,
        darkMode: false,
        language: 'en',
    });

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
        toast.success('Setting updated');
    };

    const handleExportData = () => {
        toast.success('Data export request submitted. You will receive an email shortly.');
    };

    const handleDeleteAccount = () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        toast.error('Account deletion requires contacting support.');
    };

    return (
        <CustomerLayout title="Settings" subtitle="Configure your account preferences">
            <div className="max-w-3xl space-y-6">
                {/* Notification Settings */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-teal-500" />
                        Notification Settings
                    </h2>
                    <div className="space-y-4">
                        <SettingToggle label="Email Notifications" description="Receive email notifications for important updates" checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
                        <SettingToggle label="Inquiry Alerts" description="Get notified when someone sends you an inquiry" checked={settings.inquiryAlerts} onChange={() => handleToggle('inquiryAlerts')} />
                        <SettingToggle label="Weekly Report" description="Receive a weekly summary of your portfolio activity" checked={settings.weeklyReport} onChange={() => handleToggle('weeklyReport')} />
                        <SettingToggle label="Marketing Emails" description="Receive tips, updates, and promotional offers" checked={settings.marketingEmails} onChange={() => handleToggle('marketingEmails')} />
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-teal-500" />
                        Security Settings
                    </h2>
                    <div className="space-y-4">
                        <SettingToggle label="Two-Factor Authentication" description="Add an extra layer of security to your account" checked={settings.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth')} />
                        <div className="flex items-center justify-between py-4 border-t">
                            <div>
                                <p className="font-medium text-gray-900">Change Password</p>
                                <p className="text-sm text-gray-500">Update your password regularly</p>
                            </div>
                            <a href="/customer/profile" className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg font-medium">
                                Change
                            </a>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Sun className="w-5 h-5 mr-2 text-teal-500" />
                        Appearance
                    </h2>
                    <div className="space-y-4">
                        <SettingToggle label="Dark Mode" description="Switch between light and dark theme" checked={settings.darkMode} onChange={() => handleToggle('darkMode')} icon={settings.darkMode ? Moon : Sun} />
                        <div className="flex items-center justify-between py-4 border-t">
                            <div>
                                <p className="font-medium text-gray-900 flex items-center"><Globe className="w-4 h-4 mr-2" />Language</p>
                                <p className="text-sm text-gray-500">Choose your preferred language</p>
                            </div>
                            <select value={settings.language} onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))} className="px-4 py-2 border rounded-lg text-sm">
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="es">Spanish</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Download className="w-5 h-5 mr-2 text-teal-500" />
                        Data Management
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-medium text-gray-900">Export My Data</p>
                                <p className="text-sm text-gray-500">Download all your data in JSON format</p>
                            </div>
                            <button onClick={handleExportData} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                                <Download className="w-4 h-4 mr-2" />Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                    <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center">
                        <Trash2 className="w-5 h-5 mr-2" />
                        Danger Zone
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Delete Account</p>
                            <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                        </div>
                        <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

// Toggle component
const SettingToggle = ({ label, description, checked, onChange, icon: Icon }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center">
            {Icon && <Icon className="w-5 h-5 mr-3 text-gray-400" />}
            <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
        </label>
    </div>
);

export default CustomerSettings;
