import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ServiceModal from '@/components/customer/modals/ServiceModal';
import { customerServicesApi } from '@/api/endpoints/customer/services';
import {
    Package,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    MoreVertical,
    Filter,
    Grid,
    List,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerServices = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const data = await customerServicesApi.getMyServices();
            // Map backend fields to frontend model
            const mappedServices = (data || []).map(service => ({
                ...service,
                description: service.short_description || service.full_description || '', // Map description
                image_url: service.banner_image_url || service.icon_url || '', // Map image
                icon: service.icon_url || '', // Map icon
                is_active: service.status === 'active' // Map status
            }));
            setServices(mappedServices);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedService(null);
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;

        try {
            await customerServicesApi.deleteService(id);
            toast.success('Service deleted successfully!');
            fetchServices();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to delete service');
        }
    };

    const handleSubmit = async (data) => {
        try {
            // Map frontend fields back to backend schema
            const payload = {
                title: data.title,
                short_description: data.description, // Map description to short_description
                full_description: data.description, // Also set full_description just in case
                category: data.category,
                pricing: data.pricing,
                banner_image_url: data.image_url, // Map image
                icon_url: data.icon || data.image_url, // Map icon (fallback to image if icon missing, or use specific icon field if separate)
                // Actually, if 'icon' in modal is a class name, sending it as URL might vary, but let's stick to Schema which expects string.
                // Re-verifying schema: icon_url is String(500).
                status: data.is_active ? 'active' : 'inactive', // Map status
                publish_to_portfolio: data.is_active
            };

            if (selectedService) {
                await customerServicesApi.updateService(selectedService.id, payload);
                toast.success('Service updated successfully!');
            } else {
                await customerServicesApi.createService(payload);
                toast.success('Service created successfully!');
            }
            setIsModalOpen(false);
            setSelectedService(null);
            fetchServices();
        } catch (error) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.detail || 'Failed to save service');
            // throw error; // Don't throw to avoid unhandled rejections if parent doesn't catch
        }
    };

    // Filter services
    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'active' && service.is_active) ||
            (filterStatus === 'inactive' && !service.is_active);

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: services.length,
        active: services.filter((s) => s.is_active).length,
        inactive: services.filter((s) => !s.is_active).length,
    };

    return (
        <CustomerLayout title="My Services" subtitle="Manage your service offerings">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Services</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Inactive</p>
                            <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                            <EyeOff className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-initial sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all text-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Service
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No services found</h3>
                    <p className="text-gray-500 mt-1">
                        {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first service'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={handleCreate}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Service
                        </button>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            {/* Image */}
                            <div className="h-40 bg-gradient-to-br from-teal-100 to-cyan-100 relative overflow-hidden">
                                {service.image_url ? (
                                    <img
                                        src={service.image_url}
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-16 h-16 text-teal-300" />
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${service.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                    {service.title || 'Untitled Service'}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                    {service.description || 'No description'}
                                </p>

                                {service.category && (
                                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mb-3">
                                        {service.category}
                                    </span>
                                )}

                                {service.pricing && (
                                    <p className="text-lg font-bold text-teal-600 mb-3">{service.pricing}</p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        {service.updated_at && format(new Date(service.updated_at), 'MMM dd, yyyy')}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Service
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Pricing
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                    {service.image_url ? (
                                                        <img
                                                            src={service.image_url}
                                                            alt={service.title}
                                                            className="w-10 h-10 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-teal-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{service.title || 'Untitled'}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                                        {service.description || 'No description'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.category ? (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                    {service.category}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {service.pricing || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${service.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {service.is_active ? (
                                                    <>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(service)}
                                                    className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedService(null);
                }}
                onSubmit={handleSubmit}
                service={selectedService}
            />
        </CustomerLayout>
    );
};

export default CustomerServices;
