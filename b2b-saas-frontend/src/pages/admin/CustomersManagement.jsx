import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CustomerEditModal from '@/components/admin/CustomerEditModal';
import { adminCustomersApi } from '@/api/endpoints/adminCustomers';
import {
    Users,
    Search,
    Edit,
    Eye,
    Building2,
    CreditCard,
    Mail,
    Phone,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const CustomersManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDetail, setCustomerDetail] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, searchQuery]);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const data = await adminCustomersApi.getCustomers(currentPage, itemsPerPage, searchQuery);
            setCustomers(data);
        } catch (error) {
            toast.error('Failed to fetch customers');
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetail = async (customerId) => {
        try {
            const detail = await adminCustomersApi.getCustomer(customerId);
            setCustomerDetail(detail);
            setIsDetailModalOpen(true);
        } catch (error) {
            toast.error('Failed to fetch customer details');
            console.error('Error fetching customer detail:', error);
        }
    };

    const handleUpdateCustomer = async (customerData) => {
        try {
            await adminCustomersApi.updateCustomer(selectedCustomer.id, customerData);
            toast.success('Customer updated successfully!');
            fetchCustomers();
            setIsEditModalOpen(false);
            setSelectedCustomer(null);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to update customer');
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                            <p className="text-sm text-gray-500">View and manage customer accounts</p>
                        </div>
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
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : customers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No customers found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tenant ID
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
                                        {customers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                            {customer.full_name?.charAt(0).toUpperCase() || customer.email?.charAt(0).toUpperCase() || 'C'}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {customer.full_name || 'No name'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">ID: {customer.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                            {customer.email || 'No email'}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                            {customer.phone_number || 'No phone'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {customer.tenant_id || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {customer.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetail(customer.id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCustomer(customer);
                                                                setIsEditModalOpen(true);
                                                            }}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit customer"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {customers.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Showing {customers.length} customers
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                        Page {currentPage}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        disabled={customers.length < itemsPerPage}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            <CustomerEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedCustomer(null);
                }}
                onSubmit={handleUpdateCustomer}
                customer={selectedCustomer}
            />

            {/* Detail Modal */}
            {isDetailModalOpen && customerDetail && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setIsDetailModalOpen(false)}
                        />
                        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Customer Details
                                        </h3>
                                        <p className="text-sm text-gray-500">{customerDetail.full_name || customerDetail.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Basic Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        Basic Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-gray-500">Full Name</span>
                                            <p className="text-sm font-medium text-gray-900">{customerDetail.full_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Email</span>
                                            <p className="text-sm font-medium text-gray-900">{customerDetail.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Phone</span>
                                            <p className="text-sm font-medium text-gray-900">{customerDetail.phone_number || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500">Status</span>
                                            <p className={`text-sm font-medium ${customerDetail.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                {customerDetail.is_active ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info */}
                                {customerDetail.company && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                                            <Building2 className="w-4 h-4 mr-2" />
                                            Company Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-blue-500">Company Name</span>
                                                <p className="text-sm font-medium text-gray-900">{customerDetail.company.company_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-blue-500">Website</span>
                                                <p className="text-sm font-medium text-gray-900">{customerDetail.company.website_url || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-blue-500">City</span>
                                                <p className="text-sm font-medium text-gray-900">{customerDetail.company.city || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-blue-500">Country</span>
                                                <p className="text-sm font-medium text-gray-900">{customerDetail.company.country || 'N/A'}</p>
                                            </div>
                                            {customerDetail.company.tagline && (
                                                <div className="col-span-2">
                                                    <span className="text-xs text-blue-500">Tagline</span>
                                                    <p className="text-sm font-medium text-gray-900">{customerDetail.company.tagline}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Subscription Info */}
                                {customerDetail.subscription && (
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-purple-700 mb-3 flex items-center">
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Subscription Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-xs text-purple-500">Plan</span>
                                                <p className="text-sm font-medium text-gray-900">{customerDetail.subscription.plan?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-purple-500">Status</span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customerDetail.subscription.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {customerDetail.subscription.status}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-purple-500">Price</span>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {customerDetail.subscription.plan?.currency} {customerDetail.subscription.plan?.price}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-purple-500">End Date</span>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(customerDetail.subscription.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!customerDetail.company && !customerDetail.subscription && (
                                    <div className="text-center py-4 text-gray-500">
                                        <p>No company or subscription information available</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersManagement;
