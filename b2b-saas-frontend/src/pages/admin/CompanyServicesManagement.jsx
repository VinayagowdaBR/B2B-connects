import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ServiceEditModal from '@/components/admin/ServiceEditModal';
import { adminServicesApi } from '@/api/endpoints/adminServices';
import {
  Briefcase,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Tag,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await adminServicesApi.getAllServices();
      setServices(data);
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminServicesApi.updateService(selectedService.id, data);
      toast.success('Service updated successfully!');
      fetchServices();
      setIsModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update service');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await adminServicesApi.deleteService(id);
      toast.success('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
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

    const matchesTenant = !filterTenant || service.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesStatus && matchesTenant;
  });

  // Get unique tenants for filter
  const uniqueTenants = [...new Set(services.map((s) => s.tenant_id))].sort((a, b) => a - b);

  // Stats
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.is_active).length;
  const uniqueCompanies = uniqueTenants.length;
  const withImages = services.filter((s) => s.image_url).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Services</h1>
              <p className="text-sm text-gray-500">Manage all customers' services</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalServices}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Services</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeServices}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{uniqueCompanies}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Images</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{withImages}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              {/* Tenant Filter */}
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <select
                  value={filterTenant}
                  onChange={(e) => setFilterTenant(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">All Companies</option>
                  {uniqueTenants.map((tenantId) => (
                    <option key={tenantId} value={tenantId}>
                      Tenant #{tenantId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                Showing {filteredServices.length} of {totalServices} services
              </div>
            </div>
          </div>

          {/* Services Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No services found</p>
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
                        Tenant
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Updated
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            {service.image_url ? (
                              <img
                                src={service.image_url}
                                alt={service.title}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-6 h-6 text-indigo-600" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {service.title || 'Untitled Service'}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                                {service.description || 'No description'}
                              </div>
                              {service.icon && (
                                <div className="text-xs text-gray-400 mt-1">Icon: {service.icon}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                            #{service.tenant_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service.category ? (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              <Tag className="w-3 h-3 mr-1" />
                              {service.category}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">No category</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {service.pricing || <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                              service.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(service.updated_at), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
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
        </div>
      </main>

      {/* Modal */}
      <ServiceEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        onSubmit={handleUpdate}
        service={selectedService}
      />
    </div>
  );
};

export default CompanyServicesManagement;
