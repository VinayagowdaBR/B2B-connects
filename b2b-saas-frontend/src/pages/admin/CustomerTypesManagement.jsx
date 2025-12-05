import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CustomerTypeModal from '@/components/admin/CustomerTypeModal';
import { customerTypesApi } from '@/api/endpoints/customerTypes';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Users,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const CustomerTypesManagement = () => {
  const [customerTypes, setCustomerTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomerTypes();
  }, []);

  const fetchCustomerTypes = async () => {
    try {
      setIsLoading(true);
      const data = await customerTypesApi.getCustomerTypes();
      setCustomerTypes(data);
    } catch (error) {
      toast.error('Failed to fetch customer types');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await customerTypesApi.createCustomerType(data);
      toast.success('Customer type created successfully!');
      fetchCustomerTypes();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create customer type');
      throw error;
    }
  };

  const handleUpdate = async (data) => {
    try {
      await customerTypesApi.updateCustomerType(selectedType.id, data);
      toast.success('Customer type updated successfully!');
      fetchCustomerTypes();
      setIsModalOpen(false);
      setSelectedType(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update customer type');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer type? This is a soft delete.')) return;

    try {
      await customerTypesApi.deleteCustomerType(id);
      toast.success('Customer type deleted successfully!');
      fetchCustomerTypes();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete customer type');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await customerTypesApi.setDefaultCustomerType(id);
      toast.success('Default customer type updated!');
      fetchCustomerTypes();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to set default');
    }
  };

  const filteredTypes = customerTypes.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const defaultType = customerTypes.find((type) => type.is_default);
  const activeCount = customerTypes.filter((type) => type.is_active).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Types</h1>
              <p className="text-sm text-gray-500">Manage customer categories and classifications</p>
            </div>
            <button
              onClick={() => {
                setSelectedType(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Customer Type</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Types</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{customerTypes.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Types</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Default Type</p>
                  <p className="text-lg font-bold text-amber-600 mt-2 truncate">
                    {defaultType?.name || 'None'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Customer Types Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTypes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No customer types found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTypes.map((type) => (
                <div
                  key={type.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{type.name}</h3>
                          {type.is_default && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              <Star className="w-3 h-3 mr-1" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {type.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          type.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {type.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                      <span className="text-xs text-gray-500">ID: {type.id}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedType(type);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {!type.is_default && (
                      <button
                        onClick={() => handleSetDefault(type.id)}
                        className="px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set Default</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <CustomerTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedType(null);
        }}
        onSubmit={selectedType ? handleUpdate : handleCreate}
        customerType={selectedType}
      />
    </div>
  );
};

export default CustomerTypesManagement;
