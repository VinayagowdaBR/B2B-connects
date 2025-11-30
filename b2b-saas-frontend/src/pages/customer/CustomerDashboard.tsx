import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ShoppingBag, Heart, CreditCard, Package } from 'lucide-react';

const CustomerDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const quickLinks = [
        { title: 'My Profile', description: 'View and edit your profile', icon: User, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500/10' },
        { title: 'My Orders', description: 'Track your orders', icon: ShoppingBag, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500/10' },
        { title: 'Wishlist', description: 'View saved items', icon: Heart, color: 'from-red-500 to-red-600', bgColor: 'bg-red-500/10' },
        { title: 'Payment Methods', description: 'Manage payment options', icon: CreditCard, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500/10' },
    ];

    const recentOrders = [
        { id: '#ORD-001', product: 'Premium Package', status: 'Delivered', date: '2024-11-28' },
        { id: '#ORD-002', product: 'Standard Package', status: 'In Transit', date: '2024-11-29' },
        { id: '#ORD-003', product: 'Basic Package', status: 'Processing', date: '2024-11-30' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800';
            case 'In Transit':
                return 'bg-blue-100 text-blue-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                            <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.name}!</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {quickLinks.map((link, index) => (
                        <button
                            key={index}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 text-left transform hover:-translate-y-1 group"
                        >
                            <div className={`inline-flex p-3 rounded-lg ${link.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                                <link.icon className={`w-6 h-6 bg-gradient-to-r ${link.color} bg-clip-text`} style={{ stroke: 'url(#gradient)' }} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{link.title}</h3>
                            <p className="text-sm text-gray-600">{link.description}</p>
                        </button>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-primary-600" />
                        Recent Orders
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, index) => (
                                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="py-4 px-4 text-sm text-gray-700">{order.product}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Account Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-semibold text-gray-900">12</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Pending Orders</span>
                                <span className="font-semibold text-gray-900">2</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Wishlist Items</span>
                                <span className="font-semibold text-gray-900">5</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-md p-6 text-white">
                        <h2 className="text-xl font-bold mb-4">Need Help?</h2>
                        <p className="text-white/90 mb-4">
                            Our support team is here to assist you with any questions or concerns.
                        </p>
                        <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
