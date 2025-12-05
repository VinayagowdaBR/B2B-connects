import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProjectEditModal from '@/components/admin/ProjectEditModal';
import { adminProjectsApi } from '@/api/endpoints/adminProjects';
import {
  FolderOpen,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Tag,
  Star,
  Calendar,
  ExternalLink,
  Code,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await adminProjectsApi.getAllProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to fetch projects');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminProjectsApi.updateProject(selectedProject.id, data);
      toast.success('Project updated successfully!');
      fetchProjects();
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update project');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await adminProjectsApi.deleteProject(id);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && project.is_active) ||
      (filterStatus === 'inactive' && !project.is_active);

    const matchesFeatured =
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && project.is_featured) ||
      (filterFeatured === 'regular' && !project.is_featured);

    const matchesTenant = !filterTenant || project.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesStatus && matchesFeatured && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(projects.map((p) => p.tenant_id))].sort((a, b) => a - b);

  // Stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.is_active).length;
  const featuredProjects = projects.filter((p) => p.is_featured).length;
  const uniqueCompanies = uniqueTenants.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Company Projects</h1>
              <p className="text-sm text-gray-500">Manage all customers' project portfolios</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalProjects}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeProjects}</p>
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
                  <p className="text-3xl font-bold text-amber-600 mt-2">{featuredProjects}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
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
                placeholder="Search projects by title, client, or category..."
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
                <option value="all">All Projects</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
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
                {filteredProjects.length} of {totalProjects} projects
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No projects found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
                    >
                      {/* Project Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100">
                        {project.featured_image ? (
                          <img
                            src={project.featured_image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FolderOpen className="w-16 h-16 text-indigo-300" />
                          </div>
                        )}
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                            #{project.tenant_id}
                          </span>
                          {project.is_featured && (
                            <span className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          {project.project_url && (
                            <a
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                            {project.title || 'Untitled Project'}
                          </h3>
                        </div>

                        {project.client_name && (
                          <p className="text-sm text-indigo-600 font-medium mb-2">
                            Client: {project.client_name}
                          </p>
                        )}

                        {project.category && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {project.category}
                            </span>
                          </div>
                        )}

                        {project.short_description && (
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                            {project.short_description}
                          </p>
                        )}

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {project.completion_date && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(project.completion_date), 'MMM yyyy')}
                            </div>
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              project.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {project.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
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
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Completed
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
                        {filteredProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-start space-x-3">
                                {project.featured_image ? (
                                  <img
                                    src={project.featured_image}
                                    alt={project.title}
                                    className="w-16 h-12 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <FolderOpen className="w-6 h-6 text-indigo-600" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {project.title || 'Untitled Project'}
                                    </div>
                                    {project.is_featured && (
                                      <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />
                                    )}
                                    {project.project_url && (
                                      <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    )}
                                  </div>
                                  {project.short_description && (
                                    <div className="text-xs text-gray-600 line-clamp-1 mt-1">
                                      {project.short_description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                #{project.tenant_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {project.client_name || <span className="text-gray-400">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {project.category ? (
                                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {project.category}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">No category</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {project.completion_date ? (
                                format(new Date(project.completion_date), 'MMM dd, yyyy')
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                  project.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {project.is_active ? (
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
                                  onClick={() => handleEdit(project)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(project.id)}
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
      <ProjectEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdate}
        project={selectedProject}
      />
    </div>
  );
};

export default CompanyProjectsManagement;
