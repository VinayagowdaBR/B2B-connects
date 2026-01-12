import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { usersApi } from '@/api/endpoints/users';
import {
    Users,
    Check,
    X,
    Search,
    Clock,
    ShieldAlert,
    RotateCcw
} from 'lucide-react';

const PendingApprovals = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('pending'); // pending, approved, rejected

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await usersApi.getApprovals(activeTab);
            setUsers(data);
        } catch (error) {
            toast.error(`Failed to fetch ${activeTab} users`);
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await usersApi.approveUser(userId);
            toast.success('User approved successfully');
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to approve user');
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm('Are you sure you want to reject this user?')) return;

        try {
            await usersApi.rejectUser(userId);
            toast.success('User rejected');
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to reject user');
        }
    };

    const handleReset = async (userId) => {
        try {
            await usersApi.resetUser(userId);
            toast.success('User status reset to pending');
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to reset user');
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone_number?.includes(searchQuery) ||
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 'approved', label: 'Approved', icon: Check, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'rejected', label: 'Rejected', icon: X, color: 'text-red-600', bg: 'bg-red-50' }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Approvals</h1>
                            <p className="text-sm text-gray-500">Manage user registration requests</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg w-fit">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }
                                `}
                            >
                                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-12">
                                <ShieldAlert className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No {activeTab} users found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Applicant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                                                            {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.full_name || 'No Name'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{user.email}</div>
                                                    <div className="text-sm text-gray-500">{user.phone_number || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 w-fit
                                                        ${activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        ${activeTab === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                                        ${activeTab === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                    `}>
                                                        {activeTab === 'pending' && <Clock className="w-3 h-3" />}
                                                        {activeTab === 'approved' && <Check className="w-3 h-3" />}
                                                        {activeTab === 'rejected' && <X className="w-3 h-3" />}
                                                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {activeTab === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(user.id)}
                                                                    className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors flex items-center gap-1"
                                                                    title="Approve User"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(user.id)}
                                                                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors flex items-center gap-1"
                                                                    title="Reject Request"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {activeTab === 'approved' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleReject(user.id)}
                                                                    className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors flex items-center gap-1"
                                                                    title="Reject User"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                    Reject
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReset(user.id)}
                                                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
                                                                    title="Reset to Pending"
                                                                >
                                                                    <RotateCcw className="w-4 h-4" />
                                                                    Reset
                                                                </button>
                                                            </>
                                                        )}
                                                        {activeTab === 'rejected' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(user.id)}
                                                                    className="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors flex items-center gap-1"
                                                                    title="Approve User"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReset(user.id)}
                                                                    className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-1"
                                                                    title="Reset to Pending"
                                                                >
                                                                    <RotateCcw className="w-4 h-4" />
                                                                    Reset
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PendingApprovals;
