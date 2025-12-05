import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import InquiryDetailModal from '@/components/admin/InquiryDetailModal';
import InquiryEditModal from '@/components/admin/InquiryEditModal';
import { adminInquiriesApi } from '@/api/endpoints/adminInquiries';
import {
  Mail,
  Search,
  Edit,
  Trash2,
  Eye,
  Building2,
  Filter,
  Phone,
  Calendar,
  MessageSquare,
  Paperclip,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const CompanyInquiriesManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const data = await adminInquiriesApi.getAllInquiries();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminInquiriesApi.updateInquiry(selectedInquiry.id, data);
      toast.success('Inquiry updated successfully!');
      fetchInquiries();
      setIsEditModalOpen(false);
      setSelectedInquiry(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update inquiry');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      await adminInquiriesApi.deleteInquiry(id);
      toast.success('Inquiry deleted successfully!');
      fetchInquiries();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete inquiry');
    }
  };

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'New' };
      case 'in_progress':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'In Progress' };
      case 'resolved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resolved' };
      case 'closed':
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Closed' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: status };
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesTenant = !filterTenant || inquiry.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesStatus && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(inquiries.map((i) => i.tenant_id))].sort((a, b) => a - b);

  // Stats
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const inProgressInquiries = inquiries.filter((i) => i.status === 'in_progress').length;
  const resolvedInquiries = inquiries.filter((i) => i.status === 'resolved').length;
  const uniqueCompanies = uniqueTenants.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Inquiries</h1>
              <p className="text-sm text-gray-500">Manage all customer inquiries and contact forms</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalInquiries}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{newInquiries}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{inProgressInquiries}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{resolvedInquiries}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{uniqueCompanies}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
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
                placeholder="Search by name, email, subject, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

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

              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                {filteredInquiries.length} of {totalInquiries} inquiries
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInquiries.map((inquiry) => {
                    const statusBadge = getStatusBadge(inquiry.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <div
                        key={inquiry.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all p-6 group"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                              #{inquiry.tenant_id}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 ${statusBadge.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusBadge.label}</span>
                            </span>
                          </div>
                          {inquiry.attachment_url && (
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-900 font-semibold">
                            <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                            <span className="truncate">{inquiry.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span>{inquiry.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Subject */}
                        {inquiry.subject && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {inquiry.subject}
                            </p>
                          </div>
                        )}

                        {/* Message Preview */}
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {inquiry.message}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleView(inquiry)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(inquiry)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Update Status"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Message
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInquiries.map((inquiry) => {
                          const statusBadge = getStatusBadge(inquiry.status);
                          const StatusIcon = statusBadge.icon;

                          return (
                            <tr key={inquiry.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {inquiry.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate flex items-center mt-0.5">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {inquiry.email}
                                  </div>
                                  {inquiry.phone && (
                                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                      <Phone className="w-3 h-3 mr-1" />
                                      {inquiry.phone}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                  #{inquiry.tenant_id}
                                </span>
                              </td>
                              <td className="px-6 py-4 max-w-xs">
                                <div className="text-sm text-gray-900 line-clamp-2">
                                  {inquiry.subject || <span className="text-gray-400">No subject</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4 max-w-md">
                                <p className="text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusBadge.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {format(new Date(inquiry.created_at), 'hh:mm a')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleView(inquiry)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(inquiry)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(inquiry.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <InquiryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedInquiry(null);
        }}
        inquiry={selectedInquiry}
      />

      <InquiryEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedInquiry(null);
        }}
        onSubmit={handleUpdate}
        inquiry={selectedInquiry}
      />
    </div>
  );
};

export default CompanyInquiriesManagement;
