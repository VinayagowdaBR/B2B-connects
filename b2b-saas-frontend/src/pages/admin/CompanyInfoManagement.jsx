import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CompanyInfoModal from '@/components/admin/CompanyInfoModal';
import { companyInfoApi } from '@/api/endpoints/companyInfo';
import {
  Building2,
  Search,
  Edit,
  Eye,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  User,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyInfoManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await companyInfoApi.getAllCompanyInfos();
      setCompanies(data);
    } catch (error) {
      toast.error('Failed to fetch company information');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await companyInfoApi.updateCompanyInfo(selectedCompany.id, data);
      toast.success('Company information updated successfully!');
      fetchCompanies();
      setIsModalOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update company info');
      throw error;
    }
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const filteredCompanies = companies.filter((company) =>
    company.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.tenant_id?.toString().includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
              <p className="text-sm text-gray-500">Manage all customers' company details</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{companies.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Logo</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {companies.filter((c) => c.logo_url).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">With Social Media</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {companies.filter((c) => c.linkedin_url || c.instagram_url || c.facebook_url).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Complete Profiles</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">
                    {companies.filter((c) => c.about && c.mission && c.vision).length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
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
                placeholder="Search by company name, email, or tenant ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No companies found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      {/* Company Header */}
                      <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            {company.logo_url ? (
                              <img
                                src={company.logo_url}
                                alt={company.company_name}
                                className="w-16 h-16 object-contain rounded-lg bg-white p-2 mb-3"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
                                <Building2 className="w-8 h-8 text-indigo-600" />
                              </div>
                            )}
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                              {company.company_name || 'Unnamed Company'}
                            </h3>
                            {company.tagline && (
                              <p className="text-sm text-gray-600 line-clamp-1 mt-1">{company.tagline}</p>
                            )}
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                          Tenant #{company.tenant_id}
                        </span>
                      </div>

                      {/* Company Details */}
                      <div className="p-6 space-y-3">
                        {company.email && (
                          <div className="flex items-start space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 truncate">{company.email}</span>
                          </div>
                        )}
                        {company.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600">{company.phone}</span>
                          </div>
                        )}
                        {company.city && (
                          <div className="flex items-start space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">
                              {company.city}
                              {company.state && `, ${company.state}`}
                              {company.country && ` - ${company.country}`}
                            </span>
                          </div>
                        )}
                        {company.founding_year && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600">Founded {company.founding_year}</span>
                          </div>
                        )}

                        {/* Social Media Icons */}
                        {(company.linkedin_url || company.instagram_url || company.facebook_url || company.youtube_url) && (
                          <div className="flex items-center space-x-2 pt-2">
                            {company.linkedin_url && (
                              <a
                                href={company.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                            {company.instagram_url && (
                              <a
                                href={company.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                              >
                                <Instagram className="w-4 h-4" />
                              </a>
                            )}
                            {company.facebook_url && (
                              <a
                                href={company.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Facebook className="w-4 h-4" />
                              </a>
                            )}
                            {company.youtube_url && (
                              <a
                                href={company.youtube_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Youtube className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Updated {format(new Date(company.updated_at), 'MMM dd, yyyy')}
                        </span>
                        <button
                          onClick={() => handleViewDetails(company)}
                          className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
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
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Social
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
                        {filteredCompanies.map((company) => (
                          <tr key={company.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {company.logo_url ? (
                                  <img
                                    src={company.logo_url}
                                    alt={company.company_name}
                                    className="w-10 h-10 object-contain rounded"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {company.company_name || 'Unnamed'}
                                  </div>
                                  {company.tagline && (
                                    <div className="text-xs text-gray-500 line-clamp-1">{company.tagline}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                #{company.tenant_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="space-y-1">
                                {company.email && (
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-3 h-3 text-gray-400" />
                                    <span className="truncate max-w-[150px]">{company.email}</span>
                                  </div>
                                )}
                                {company.phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    <span>{company.phone}</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {company.city || company.state ? (
                                <div>
                                  {company.city}
                                  {company.state && `, ${company.state}`}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-1">
                                {company.linkedin_url && <Linkedin className="w-4 h-4 text-blue-600" />}
                                {company.instagram_url && <Instagram className="w-4 h-4 text-pink-600" />}
                                {company.facebook_url && <Facebook className="w-4 h-4 text-blue-600" />}
                                {company.youtube_url && <Youtube className="w-4 h-4 text-red-600" />}
                                {!company.linkedin_url && !company.instagram_url && !company.facebook_url && !company.youtube_url && (
                                  <span className="text-gray-400 text-xs">None</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {format(new Date(company.updated_at), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleViewDetails(company)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
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
      <CompanyInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
        onSubmit={handleUpdate}
        companyInfo={selectedCompany}
      />
    </div>
  );
};

export default CompanyInfoManagement;
