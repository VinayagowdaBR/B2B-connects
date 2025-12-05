import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TeamMemberEditModal from '@/components/admin/TeamMemberEditModal';
import { adminTeamMembersApi } from '@/api/endpoints/adminTeamMembers';
import {
  Users,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  User,
  Briefcase,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyTeamMembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await adminTeamMembersApi.getAllTeamMembers();
      setMembers(data);
    } catch (error) {
      toast.error('Failed to fetch team members');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminTeamMembersApi.updateTeamMember(selectedMember.id, data);
      toast.success('Team member updated successfully!');
      fetchMembers();
      setIsModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update team member');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      await adminTeamMembersApi.deleteTeamMember(id);
      toast.success('Team member deleted successfully!');
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete team member');
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && member.is_active) ||
      (filterStatus === 'inactive' && !member.is_active);

    const matchesDepartment = !filterDepartment || member.department === filterDepartment;
    const matchesTenant = !filterTenant || member.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesStatus && matchesDepartment && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(members.map((m) => m.tenant_id))].sort((a, b) => a - b);
  const uniqueDepartments = [...new Set(members.map((m) => m.department).filter(Boolean))];

  // Stats
  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.is_active).length;
  const uniqueCompanies = uniqueTenants.length;
  const withPhotos = members.filter((m) => m.photo_url).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
              <p className="text-sm text-gray-500">Manage all customers' team members</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'table'
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
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalMembers}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeMembers}</p>
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
                  <p className="text-sm font-medium text-gray-600">With Photos</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{withPhotos}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
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
                placeholder="Search by name, position, department, or email..."
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
                {filteredMembers.length} of {totalMembers} members
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No team members found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
                    >
                      {/* Photo */}
                      <div className="relative aspect-square bg-gradient-to-br from-indigo-100 to-purple-100">
                        {member.photo_url ? (
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-24 h-24 text-indigo-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                            #{member.tenant_id}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${member.is_active
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              }`}
                          >
                            {member.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="p-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                          {member.name || 'Unnamed Member'}
                        </h3>
                        <div className="flex items-center text-sm text-indigo-600 mb-1">
                          <Briefcase className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{member.position || 'No position'}</span>
                        </div>
                        {member.department && (
                          <p className="text-xs text-gray-500 mb-3">{member.department}</p>
                        )}

                        {member.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{member.bio}</p>
                        )}

                        {/* Contact & Social */}
                        <div className="space-y-2 pt-3 border-t border-gray-100">
                          {member.email && (
                            <div className="flex items-center text-xs text-gray-600 truncate">
                              <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                              {member.phone}
                            </div>
                          )}

                          {/* Social Links */}
                          {(member.linkedin_url || member.twitter_url || member.github_url) && (
                            <div className="flex items-center space-x-2 pt-2">
                              {member.linkedin_url && (
                                <a
                                  href={member.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                              {member.twitter_url && (
                                <a
                                  href={member.twitter_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-blue-400 hover:bg-blue-50 rounded"
                                >
                                  <Twitter className="w-4 h-4" />
                                </a>
                              )}
                              {member.github_url && (
                                <a
                                  href={member.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-gray-800 hover:bg-gray-100 rounded"
                                >
                                  <Github className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-3 border-t border-gray-100 mt-3">
                            {member.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                +{member.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
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
                            Member
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Contact
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
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {member.photo_url ? (
                                  <img
                                    src={member.photo_url}
                                    alt={member.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <User className="w-6 h-6 text-indigo-600" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {member.name || 'Unnamed Member'}
                                  </div>
                                  {member.skills && member.skills.length > 0 && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {member.skills.slice(0, 2).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                #{member.tenant_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {member.position || <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {member.department || <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {member.email && (
                                  <div className="flex items-center text-xs text-gray-600 truncate max-w-[200px]">
                                    <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                    {member.email}
                                  </div>
                                )}
                                {member.phone && (
                                  <div className="flex items-center text-xs text-gray-600">
                                    <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                    {member.phone}
                                  </div>
                                )}
                                <div className="flex items-center space-x-1 pt-1">
                                  {member.linkedin_url && <Linkedin className="w-3 h-3 text-blue-600" />}
                                  {member.twitter_url && <Twitter className="w-3 h-3 text-blue-400" />}
                                  {member.github_url && <Github className="w-3 h-3 text-gray-700" />}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${member.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {member.is_active ? (
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
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(member)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(member.id)}
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
      <TeamMemberEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={handleUpdate}
        member={selectedMember}
      />
    </div>
  );
};

export default CompanyTeamMembersManagement;
