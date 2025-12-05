import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CareerEditModal from '@/components/admin/CareerEditModal';
import { adminCareersApi } from '@/api/endpoints/adminCareers';
import {
  Briefcase,
  Search,
  Edit,
  Trash2,
  Building2,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';

const CompanyCareersManagement = () => {
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJobType, setFilterJobType] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      setIsLoading(true);
      const data = await adminCareersApi.getAllCareers();
      setCareers(data);
    } catch (error) {
      toast.error('Failed to fetch job postings');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminCareersApi.updateCareer(selectedCareer.id, data);
      toast.success('Job posting updated successfully!');
      fetchCareers();
      setIsModalOpen(false);
      setSelectedCareer(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update job posting');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await adminCareersApi.deleteCareer(id);
      toast.success('Job posting deleted successfully!');
      fetchCareers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete job posting');
    }
  };

  const handleEdit = (career) => {
    setSelectedCareer(career);
    setIsModalOpen(true);
  };

  // Check if job is expired or active
  const getJobStatus = (career) => {
    if (!career.closing_date) return 'active';
    const closingDate = new Date(career.closing_date);
    const today = new Date();
    return isAfter(today, closingDate) ? 'expired' : 'active';
  };

  // Filter careers
  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      career.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJobType = !filterJobType || career.job_type === filterJobType;
    const matchesDepartment = !filterDepartment || career.department === filterDepartment;
    const matchesTenant = !filterTenant || career.tenant_id?.toString().includes(filterTenant);

    const jobStatus = getJobStatus(career);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && jobStatus === 'active') ||
      (filterStatus === 'expired' && jobStatus === 'expired');

    return matchesSearch && matchesJobType && matchesDepartment && matchesStatus && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(careers.map((c) => c.tenant_id))].sort((a, b) => a - b);
  const uniqueJobTypes = [...new Set(careers.map((c) => c.job_type).filter(Boolean))];
  const uniqueDepartments = [...new Set(careers.map((c) => c.department).filter(Boolean))];

  // Stats
  const totalJobs = careers.length;
  const activeJobs = careers.filter((c) => getJobStatus(c) === 'active').length;
  const expiredJobs = careers.filter((c) => getJobStatus(c) === 'expired').length;
  const uniqueCompanies = uniqueTenants.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Careers & Job Postings</h1>
              <p className="text-sm text-gray-500">Manage all customers' job openings</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{expiredJobs}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
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
                placeholder="Search by job title, department, or location..."
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
                <option value="all">All Jobs</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired Only</option>
              </select>

              <select
                value={filterJobType}
                onChange={(e) => setFilterJobType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Job Types</option>
                {uniqueJobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
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
                {filteredCareers.length} of {totalJobs} jobs
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No job postings found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCareers.map((career) => {
                    const jobStatus = getJobStatus(career);
                    return (
                      <div
                        key={career.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all p-6 group"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                              #{career.tenant_id}
                            </span>
                            {career.job_type && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {career.job_type}
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              jobStatus === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {jobStatus === 'active' ? 'Active' : 'Expired'}
                          </span>
                        </div>

                        {/* Job Info */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {career.job_title || 'Untitled Position'}
                        </h3>

                        <div className="space-y-2 mb-4">
                          {career.department && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                              {career.department}
                            </div>
                          )}
                          {career.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                              {career.location}
                            </div>
                          )}
                          {career.salary_range && (
                            <div className="flex items-center text-sm text-green-600 font-medium">
                              <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                              {career.salary_range}
                            </div>
                          )}
                        </div>

                        {career.description && (
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                            {career.description}
                          </p>
                        )}

                        {/* Details */}
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                          {career.responsibilities && career.responsibilities.length > 0 && (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Responsibilities:</span>{' '}
                              {career.responsibilities.length} listed
                            </div>
                          )}
                          {career.requirements && career.requirements.length > 0 && (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Requirements:</span>{' '}
                              {career.requirements.length} listed
                            </div>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                          {career.posted_date && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              Posted {format(new Date(career.posted_date), 'MMM dd')}
                            </div>
                          )}
                          {career.closing_date && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              Closes {format(new Date(career.closing_date), 'MMM dd')}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => handleEdit(career)}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(career.id)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                            Job Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Salary
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Closing
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCareers.map((career) => {
                          const jobStatus = getJobStatus(career);
                          return (
                            <tr key={career.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-start space-x-3">
                                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {career.job_title || 'Untitled Position'}
                                    </div>
                                    {career.description && (
                                      <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                        {career.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                  #{career.tenant_id}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                {career.department || <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {career.job_type ? (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                    {career.job_type}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                {career.location ? (
                                  <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {career.location}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                {career.salary_range || <span className="text-gray-400">-</span>}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {career.closing_date ? (
                                  format(new Date(career.closing_date), 'MMM dd, yyyy')
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                    jobStatus === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {jobStatus === 'active' ? (
                                    <>
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Expired
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleEdit(career)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(career.id)}
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

      {/* Modal */}
      <CareerEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCareer(null);
        }}
        onSubmit={handleUpdate}
        career={selectedCareer}
      />
    </div>
  );
};

export default CompanyCareersManagement;
