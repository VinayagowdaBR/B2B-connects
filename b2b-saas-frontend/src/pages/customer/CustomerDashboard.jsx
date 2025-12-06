import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { customerServicesApi } from '@/api/endpoints/customer/services';
import { customerProductsApi } from '@/api/endpoints/customer/products';
import { customerProjectsApi } from '@/api/endpoints/customer/projects';
import { customerInquiriesApi } from '@/api/endpoints/customer/inquiries';
import {
    Package,
    ShoppingBag,
    FolderOpen,
    Mail,
    Eye,
    TrendingUp,
    Calendar,
    ArrowRight,
    Plus,
    Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        services: 0,
        products: 0,
        projects: 0,
        inquiries: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [services, products, projects, inquiries] = await Promise.allSettled([
                customerServicesApi.getMyServices(),
                customerProductsApi.getMyProducts(),
                customerProjectsApi.getMyProjects(),
                customerInquiriesApi.getMyInquiries(),
            ]);

            setStats({
                services: services.status === 'fulfilled' ? (services.value?.length || 0) : 0,
                products: products.status === 'fulfilled' ? (products.value?.length || 0) : 0,
                projects: projects.status === 'fulfilled' ? (projects.value?.length || 0) : 0,
                inquiries: inquiries.status === 'fulfilled' ? (inquiries.value?.length || 0) : 0,
            });

            // Combine and sort recent items
            const allItems = [];
            if (services.status === 'fulfilled' && services.value) {
                services.value.slice(0, 3).forEach(item => {
                    allItems.push({ type: 'Service', name: item.title, date: item.updated_at });
                });
            }
            if (products.status === 'fulfilled' && products.value) {
                products.value.slice(0, 3).forEach(item => {
                    allItems.push({ type: 'Product', name: item.name, date: item.updated_at });
                });
            }
            setRecentActivity(allItems.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            name: 'Services',
            value: stats.services,
            icon: Package,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            path: '/customer/services',
        },
        {
            name: 'Products',
            value: stats.products,
            icon: ShoppingBag,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            path: '/customer/products',
        },
        {
            name: 'Projects',
            value: stats.projects,
            icon: FolderOpen,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            path: '/customer/projects',
        },
        {
            name: 'Inquiries',
            value: stats.inquiries,
            icon: Mail,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-500/10',
            path: '/customer/inquiries',
        },
    ];

    const quickActions = [
        { name: 'Add Service', path: '/customer/services', icon: Package },
        { name: 'Add Product', path: '/customer/products', icon: ShoppingBag },
        { name: 'Add Project', path: '/customer/projects', icon: FolderOpen },
        { name: 'View Inquiries', path: '/customer/inquiries', icon: Mail },
    ];

    return (
        <CustomerLayout title="Dashboard" subtitle={`Welcome back, ${user?.full_name || 'Customer'}!`}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {statCards.map((stat) => (
                    <button
                        key={stat.name}
                        onClick={() => navigate(stat.path)}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 text-left group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                                    {isLoading ? (
                                        <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                            </div>
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex items-center mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 group-hover:text-teal-600 transition-colors">
                            <span>View all</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {quickActions.map((action) => (
                            <button
                                key={action.name}
                                onClick={() => navigate(action.path)}
                                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-teal-50 hover:to-cyan-50 border border-gray-200 hover:border-teal-300 transition-all group"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                                    <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-teal-700 text-center">
                                    {action.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Recent Activity
                    </h2>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    ) : recentActivity.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No recent activity</p>
                            <p className="text-sm mt-1">Start by adding content to your portal</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                                        <p className="text-xs text-gray-500">{activity.type}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {activity.date ? new Date(activity.date).toLocaleDateString() : 'Recently'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-xl p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">💡 Pro Tip</h3>
                        <p className="text-white/90 text-sm">
                            Complete your company profile and add at least 3 services to boost your visibility in the public portfolio.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/customer/company-info')}
                        className="mt-4 sm:mt-0 px-4 sm:px-6 py-2 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
                    >
                        Complete Profile
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default CustomerDashboard;
