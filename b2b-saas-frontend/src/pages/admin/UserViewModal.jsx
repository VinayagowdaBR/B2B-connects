import {
    X, Mail, Phone, Shield, Calendar, CheckCircle, XCircle, User,
    Building2, Globe, MapPin, CreditCard, Clock, Linkedin, Facebook,
    Instagram, Twitter, Info, Briefcase, RefreshCw, Hash
} from 'lucide-react';

const UserViewModal = ({ isOpen, onClose, user, isLoading }) => {
    if (!isOpen || !user) return null;

    const DetailItem = ({ icon: Icon, label, value, subValue, isLink }) => (
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg h-full border border-gray-100/50 hover:bg-gray-100/50 transition-colors">
            <Icon className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{label}</p>
                {isLink && value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-1 truncate block hover:underline">
                        {subValue || value}
                    </a>
                ) : (
                    <p className="text-sm font-medium text-gray-900 mt-1 break-words">{value || 'N/A'}</p>
                )}
                {!isLink && subValue && <p className="text-xs text-gray-500 mt-0.5 truncate">{subValue}</p>}
            </div>
        </div>
    );

    const SocialLink = ({ icon: Icon, url, label, colorClass }) => {
        if (!url) return null;
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${colorClass}`}
            >
                <Icon className="w-4 h-4" />
                {label}
            </a>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <User className="w-6 h-6" />
                            User Profile
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-sm shrink-0 border-2 border-white/20 shadow-inner">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-2xl font-bold truncate">{user.full_name || 'No Name'}</h3>
                            <p className="text-indigo-100 flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4 opacity-75" />
                                {user.email}
                            </p>
                            {user.company?.created_at && (
                                <p className="text-indigo-200 text-xs mt-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Joined: {new Date(user.company.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            )}
                        </div>
                        <div className="hidden sm:block text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${user.is_active
                                    ? 'bg-green-500/10 border-green-400/30 text-green-50'
                                    : 'bg-red-500/10 border-red-400/30 text-red-50'
                                }`}>
                                {user.is_active ? (
                                    <><CheckCircle className="w-4 h-4 mr-1.5" /> Active Account</>
                                ) : (
                                    <><XCircle className="w-4 h-4 mr-1.5" /> Inactive Account</>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mb-4"></div>
                            <p className="font-medium text-lg">Loading complete profile...</p>
                        </div>
                    ) : (
                        <>
                            {/* Personal Information */}
                            <section>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-gray-200">
                                    <User className="w-4 h-4 text-indigo-500" />
                                    Personal Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <DetailItem
                                        icon={Mail}
                                        label="Email Address"
                                        value={user.email}
                                    />
                                    <DetailItem
                                        icon={Phone}
                                        label="Phone Number"
                                        value={user.phone_number}
                                    />
                                    <DetailItem
                                        icon={Shield}
                                        label="User Type"
                                        value={user.user_type?.charAt(0).toUpperCase() + user.user_type?.slice(1)}
                                        subValue={`ID: ${user.id}`}
                                    />
                                </div>
                            </section>

                            {/* Company Information */}
                            {user.company && (
                                <section className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <Building2 className="w-4 h-4 text-indigo-500" />
                                        Company Profile
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h5 className="text-xl font-bold text-gray-900">{user.company.company_name}</h5>
                                            <p className="text-gray-500 mt-1">{user.company.tagline || 'No tagline'}</p>
                                            {user.company.about && (
                                                <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                                                    {user.company.about}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {user.company.industry && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                                        <Briefcase className="w-3 h-3 mr-1" /> {user.company.industry}
                                                    </span>
                                                )}
                                                {user.company.company_size && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                                                        <Users className="w-3 h-3 mr-1" /> {user.company.company_size}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <SocialLink
                                                    icon={Linkedin}
                                                    url={user.company.linkedin_url}
                                                    label="LinkedIn"
                                                    colorClass="bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20"
                                                />
                                                <SocialLink
                                                    icon={Twitter}
                                                    url={user.company.twitter_url}
                                                    label="Twitter"
                                                    colorClass="bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
                                                />
                                                <SocialLink
                                                    icon={Facebook}
                                                    url={user.company.facebook_url}
                                                    label="Facebook"
                                                    colorClass="bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20"
                                                />
                                                <SocialLink
                                                    icon={Instagram}
                                                    url={user.company.instagram_url}
                                                    label="Instagram"
                                                    colorClass="bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C]/20"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DetailItem
                                            icon={Globe}
                                            label="Website"
                                            value={user.company.website_url}
                                            isLink={true}
                                        />
                                        <DetailItem
                                            icon={MapPin}
                                            label="Address"
                                            value={user.company.address || user.company.city}
                                            subValue={[user.company.city, user.company.state, user.company.country].filter(Boolean).join(', ')}
                                        />
                                        <DetailItem
                                            icon={Hash}
                                            label="Postal Code"
                                            value={user.company.postal_code}
                                        />
                                    </div>
                                </section>
                            )}

                            {/* Subscription & Permissions Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Subscription Info */}
                                {user.subscription && (
                                    <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                            <CreditCard className="w-4 h-4 text-indigo-500" />
                                            Active Subscription
                                        </h4>
                                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-5 flex-1 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <CreditCard className="w-24 h-24 text-indigo-500" />
                                            </div>

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h5 className="text-xl font-bold text-indigo-900">{user.subscription.plan.name}</h5>
                                                        <p className="text-indigo-600 font-medium">
                                                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: user.subscription.plan.currency }).format(user.subscription.plan.price)} <span className="text-xs opacity-75">/ period</span>
                                                        </p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${user.subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {user.subscription.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                                                        <span className="w-24 text-xs font-semibold uppercase text-gray-400">Started</span>
                                                        <span className="font-medium">{new Date(user.subscription.start_date).toLocaleDateString()}</span>
                                                    </div>
                                                    {user.subscription.end_date && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                                                            <span className="w-24 text-xs font-semibold uppercase text-gray-400">Expires</span>
                                                            <span className="font-medium">{new Date(user.subscription.end_date).toLocaleDateString()}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <RefreshCw className="w-4 h-4 mr-2 text-indigo-400" />
                                                        <span className="w-24 text-xs font-semibold uppercase text-gray-400">Auto Renew</span>
                                                        <span className={`font-medium ${user.subscription.auto_renew ? 'text-green-600' : 'text-gray-500'}`}>
                                                            {user.subscription.auto_renew ? 'Enabled' : 'Disabled'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Roles & Permissions */}
                                <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <Shield className="w-4 h-4 text-indigo-500" />
                                        System Access
                                    </h4>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Assigned Roles</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {user.roles && user.roles.length > 0 ? (
                                                user.roles.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold border border-gray-200 flex items-center shadow-sm"
                                                    >
                                                        <Shield className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                                                        {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">No roles assigned</span>
                                            )}
                                        </div>

                                        {/* Placeholder for future specific permissions list if needed */}
                                        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                                            <div className="flex">
                                                <Info className="h-5 w-5 text-yellow-400" />
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">Access Level</h3>
                                                    <div className="mt-1 text-sm text-yellow-700">
                                                        <p>
                                                            {user.is_superuser
                                                                ? "This user has full Super Admin privileges and can manage all aspects of the system."
                                                                : "Standard user access based on assigned roles."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 shrink-0">
                    User ID: {user.id} • Tenant ID: {user.tenant_id || 'Global'} {user.company?.created_at && `• Registered: ${new Date(user.company?.created_at).toLocaleString()}`}
                </div>
            </div>
        </div>
    );
};

export default UserViewModal;
