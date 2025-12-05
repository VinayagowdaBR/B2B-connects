import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TestimonialEditModal from '@/components/admin/TestimonialEditModal';
import { adminTestimonialsApi } from '@/api/endpoints/adminTestimonials';
import {
  MessageSquare,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Star,
  User,
  Quote,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyTestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await adminTestimonialsApi.getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast.error('Failed to fetch testimonials');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminTestimonialsApi.updateTestimonial(selectedTestimonial.id, data);
      toast.success('Testimonial updated successfully!');
      fetchTestimonials();
      setIsModalOpen(false);
      setSelectedTestimonial(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update testimonial');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await adminTestimonialsApi.deleteTestimonial(id);
      toast.success('Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.author_company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && testimonial.is_active) ||
      (filterStatus === 'inactive' && !testimonial.is_active);

    const matchesFeatured =
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && testimonial.is_featured) ||
      (filterFeatured === 'regular' && !testimonial.is_featured);

    const matchesRating =
      filterRating === 'all' || testimonial.rating === parseInt(filterRating);

    const matchesTenant = !filterTenant || testimonial.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesStatus && matchesFeatured && matchesRating && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(testimonials.map((t) => t.tenant_id))].sort((a, b) => a - b);

  // Stats
  const totalTestimonials = testimonials.length;
  const activeTestimonials = testimonials.filter((t) => t.is_active).length;
  const featuredTestimonials = testimonials.filter((t) => t.is_featured).length;
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
    : 0;
  const uniqueCompanies = uniqueTenants.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Testimonials</h1>
              <p className="text-sm text-gray-500">Manage all customers' testimonials and reviews</p>
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
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalTestimonials}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeTestimonials}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">{featuredTestimonials}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{avgRating}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white fill-current" />
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
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by author, company, or content..."
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
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Testimonials</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
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
                {filteredTestimonials.length} of {totalTestimonials} testimonials
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No testimonials found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all p-6 relative group"
                    >
                      {/* Quote Icon */}
                      <div className="absolute top-4 right-4 text-indigo-100">
                        <Quote className="w-12 h-12" />
                      </div>

                      {/* Badges */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                          #{testimonial.tenant_id}
                        </span>
                        {testimonial.is_featured && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium flex items-center">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            testimonial.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {testimonial.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= testimonial.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-4 relative z-10">
                        "{testimonial.content}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                        {testimonial.author_image ? (
                          <img
                            src={testimonial.author_image}
                            alt={testimonial.author_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {testimonial.author_name}
                          </p>
                          {testimonial.author_position && (
                            <p className="text-xs text-gray-500 truncate">
                              {testimonial.author_position}
                            </p>
                          )}
                          {testimonial.author_company && (
                            <p className="text-xs text-indigo-600 truncate">
                              {testimonial.author_company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 z-20">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-2 bg-white shadow-lg text-indigo-600 rounded-lg hover:bg-indigo-50 border border-gray-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 bg-white shadow-lg text-red-600 rounded-lg hover:bg-red-50 border border-gray-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                            Author
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Content
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rating
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
                        {filteredTestimonials.map((testimonial) => (
                          <tr key={testimonial.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {testimonial.author_image ? (
                                  <img
                                    src={testimonial.author_image}
                                    alt={testimonial.author_name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <User className="w-5 h-5 text-indigo-600" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {testimonial.author_name}
                                  </div>
                                  {testimonial.author_position && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {testimonial.author_position}
                                    </div>
                                  )}
                                  {testimonial.author_company && (
                                    <div className="text-xs text-indigo-600 truncate">
                                      {testimonial.author_company}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                #{testimonial.tenant_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-md">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {testimonial.content}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= testimonial.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {testimonial.is_featured && (
                                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                                )}
                                <span
                                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                    testimonial.is_active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {testimonial.is_active ? (
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
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(testimonial.updated_at), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(testimonial)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(testimonial.id)}
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
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      <TestimonialEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTestimonial(null);
        }}
        onSubmit={handleUpdate}
        testimonial={selectedTestimonial}
      />
    </div>
  );
};

export default CompanyTestimonialsManagement;
