import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/layout/AdminLayout';
import {
    Settings,
    Bell,
    Shield,
    Database,
    Mail,
    Globe,
    Palette,
    Server,
    CreditCard,
    Users,
    FileText,
    Lock,
    Save,
    RefreshCw,
    AlertTriangle,
    Check,
    Zap,
    Clock,
    HardDrive,
    Image,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminSettings = () => {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'B2B SaaS Platform',
        siteDescription: 'A multi-tenant B2B SaaS platform for business management',
        adminEmail: 'admin@example.com',
        supportEmail: 'support@example.com',
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        maintenanceMode: false,
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        newUserAlert: true,
        newSubscriptionAlert: true,
        paymentFailureAlert: true,
        systemAlerts: true,
        weeklyReport: true,
        monthlyReport: false,
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        requireTwoFactor: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireSpecialChar: true,
        requireUppercase: true,
        forcePasswordChange: 90,
    });

    // Storage Settings
    const [storageSettings, setStorageSettings] = useState({
        maxFileSize: 10,
        allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
        storageProvider: 'local',
        maxStoragePerUser: 500,
        autoDeleteOldFiles: false,
    });

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        currency: 'INR',
        taxRate: 18,
        enableAutoRenewal: true,
        gracePeriod: 7,
        enableTrialPeriod: true,
        trialDays: 14,
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast.success('Settings saved successfully!');
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'storage', label: 'Storage', icon: HardDrive },
        { id: 'payment', label: 'Payment', icon: CreditCard },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        {/* Site Information */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-indigo-500" />
                                Site Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        value={generalSettings.siteName}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Admin Email
                                    </label>
                                    <input
                                        type="email"
                                        value={generalSettings.adminEmail}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, adminEmail: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Description
                                    </label>
                                    <textarea
                                        value={generalSettings.siteDescription}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Support Email
                                    </label>
                                    <input
                                        type="email"
                                        value={generalSettings.supportEmail}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={generalSettings.timezone}
                                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Mode */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Server className="w-5 h-5 mr-2 text-indigo-500" />
                                Maintenance Mode
                            </h3>
                            <SettingToggle
                                label="Enable Maintenance Mode"
                                description="When enabled, only admins can access the platform"
                                checked={generalSettings.maintenanceMode}
                                onChange={() => setGeneralSettings({ ...generalSettings, maintenanceMode: !generalSettings.maintenanceMode })}
                                color="red"
                            />
                            {generalSettings.maintenanceMode && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-sm text-red-600 flex items-center">
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Maintenance mode is active. Users cannot access the platform.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-indigo-500" />
                                Email Notifications
                            </h3>
                            <div className="space-y-4">
                                <SettingToggle
                                    label="Email Notifications"
                                    description="Enable email notifications globally"
                                    checked={notificationSettings.emailNotifications}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, emailNotifications: !notificationSettings.emailNotifications })}
                                />
                                <SettingToggle
                                    label="New User Registration Alerts"
                                    description="Get notified when a new user registers"
                                    checked={notificationSettings.newUserAlert}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, newUserAlert: !notificationSettings.newUserAlert })}
                                />
                                <SettingToggle
                                    label="New Subscription Alerts"
                                    description="Get notified for new subscription purchases"
                                    checked={notificationSettings.newSubscriptionAlert}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, newSubscriptionAlert: !notificationSettings.newSubscriptionAlert })}
                                />
                                <SettingToggle
                                    label="Payment Failure Alerts"
                                    description="Get notified when a payment fails"
                                    checked={notificationSettings.paymentFailureAlert}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, paymentFailureAlert: !notificationSettings.paymentFailureAlert })}
                                />
                                <SettingToggle
                                    label="System Alerts"
                                    description="Receive critical system alerts and warnings"
                                    checked={notificationSettings.systemAlerts}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, systemAlerts: !notificationSettings.systemAlerts })}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                                Automated Reports
                            </h3>
                            <div className="space-y-4">
                                <SettingToggle
                                    label="Weekly Report"
                                    description="Receive a weekly summary of platform activity"
                                    checked={notificationSettings.weeklyReport}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, weeklyReport: !notificationSettings.weeklyReport })}
                                />
                                <SettingToggle
                                    label="Monthly Report"
                                    description="Receive a monthly analytics report"
                                    checked={notificationSettings.monthlyReport}
                                    onChange={() => setNotificationSettings({ ...notificationSettings, monthlyReport: !notificationSettings.monthlyReport })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Lock className="w-5 h-5 mr-2 text-indigo-500" />
                                Authentication Settings
                            </h3>
                            <div className="space-y-4">
                                <SettingToggle
                                    label="Require Two-Factor Authentication"
                                    description="Force all users to enable 2FA"
                                    checked={securitySettings.requireTwoFactor}
                                    onChange={() => setSecuritySettings({ ...securitySettings, requireTwoFactor: !securitySettings.requireTwoFactor })}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Session Timeout (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={securitySettings.sessionTimeout}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Max Login Attempts
                                        </label>
                                        <input
                                            type="number"
                                            value={securitySettings.maxLoginAttempts}
                                            onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-indigo-500" />
                                Password Policy
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Password Length
                                    </label>
                                    <input
                                        type="number"
                                        value={securitySettings.passwordMinLength}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Force Password Change (days)
                                    </label>
                                    <input
                                        type="number"
                                        value={securitySettings.forcePasswordChange}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, forcePasswordChange: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 mt-6">
                                <SettingToggle
                                    label="Require Special Characters"
                                    description="Passwords must contain at least one special character"
                                    checked={securitySettings.requireSpecialChar}
                                    onChange={() => setSecuritySettings({ ...securitySettings, requireSpecialChar: !securitySettings.requireSpecialChar })}
                                />
                                <SettingToggle
                                    label="Require Uppercase Letters"
                                    description="Passwords must contain at least one uppercase letter"
                                    checked={securitySettings.requireUppercase}
                                    onChange={() => setSecuritySettings({ ...securitySettings, requireUppercase: !securitySettings.requireUppercase })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'storage':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Image className="w-5 h-5 mr-2 text-indigo-500" />
                                File Upload Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max File Size (MB)
                                    </label>
                                    <input
                                        type="number"
                                        value={storageSettings.maxFileSize}
                                        onChange={(e) => setStorageSettings({ ...storageSettings, maxFileSize: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Storage Per User (MB)
                                    </label>
                                    <input
                                        type="number"
                                        value={storageSettings.maxStoragePerUser}
                                        onChange={(e) => setStorageSettings({ ...storageSettings, maxStoragePerUser: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Allowed File Types (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={storageSettings.allowedFileTypes}
                                        onChange={(e) => setStorageSettings({ ...storageSettings, allowedFileTypes: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Database className="w-5 h-5 mr-2 text-indigo-500" />
                                Storage Provider
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['local', 'aws', 'cloudinary'].map((provider) => (
                                    <button
                                        key={provider}
                                        onClick={() => setStorageSettings({ ...storageSettings, storageProvider: provider })}
                                        className={`p-4 rounded-xl border-2 transition-all ${storageSettings.storageProvider === provider
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <p className="font-medium text-gray-900 capitalize">{provider === 'aws' ? 'AWS S3' : provider}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {provider === 'local' && 'Store files locally'}
                                            {provider === 'aws' && 'Amazon S3 storage'}
                                            {provider === 'cloudinary' && 'Cloudinary CDN'}
                                        </p>
                                        {storageSettings.storageProvider === provider && (
                                            <Check className="w-5 h-5 text-indigo-500 mt-2" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6">
                                <SettingToggle
                                    label="Auto Delete Old Files"
                                    description="Automatically delete files older than 1 year"
                                    checked={storageSettings.autoDeleteOldFiles}
                                    onChange={() => setStorageSettings({ ...storageSettings, autoDeleteOldFiles: !storageSettings.autoDeleteOldFiles })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'payment':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-indigo-500" />
                                Payment Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Default Currency
                                    </label>
                                    <select
                                        value={paymentSettings.currency}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={paymentSettings.taxRate}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Grace Period (days)
                                    </label>
                                    <input
                                        type="number"
                                        value={paymentSettings.gracePeriod}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, gracePeriod: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trial Period (days)
                                    </label>
                                    <input
                                        type="number"
                                        value={paymentSettings.trialDays}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, trialDays: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Zap className="w-5 h-5 mr-2 text-indigo-500" />
                                Subscription Options
                            </h3>
                            <div className="space-y-4">
                                <SettingToggle
                                    label="Enable Auto Renewal"
                                    description="Automatically renew subscriptions when they expire"
                                    checked={paymentSettings.enableAutoRenewal}
                                    onChange={() => setPaymentSettings({ ...paymentSettings, enableAutoRenewal: !paymentSettings.enableAutoRenewal })}
                                />
                                <SettingToggle
                                    label="Enable Trial Period"
                                    description="Allow new users to try the platform before paying"
                                    checked={paymentSettings.enableTrialPeriod}
                                    onChange={() => setPaymentSettings({ ...paymentSettings, enableTrialPeriod: !paymentSettings.enableTrialPeriod })}
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AdminLayout title="Settings" subtitle="Configure platform settings and preferences">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border p-2 sticky top-24">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {renderTabContent()}

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

// Toggle component
const SettingToggle = ({ label, description, checked, onChange, color = 'indigo' }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className={`w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-${color}-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${color}-500`}></div>
        </label>
    </div>
);

export default AdminSettings;
