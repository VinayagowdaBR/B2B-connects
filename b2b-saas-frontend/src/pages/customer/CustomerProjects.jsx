import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import ProjectModal from '@/components/customer/modals/ProjectModal';
import { customerProjectsApi } from '@/api/endpoints/customer/projects';
import { FolderOpen, Plus, Search, Edit, Trash2, Eye, EyeOff, Grid, List, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerProjects = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const data = await customerProjectsApi.getMyProjects();
            setProjects(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedProject) {
                await customerProjectsApi.updateProject(selectedProject.id, data);
                toast.success('Project updated!');
            } else {
                await customerProjectsApi.createProject(data);
                toast.success('Project created!');
            }
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error('Failed to save project');
            throw error;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await customerProjectsApi.deleteProject(id);
            toast.success('Project deleted!');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filteredProjects = projects.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <CustomerLayout title="My Projects" subtitle="Showcase your portfolio work">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-green-600">{projects.filter((p) => p.is_active).length}</p>
                        </div>
                        <Eye className="w-10 h-10 p-2 rounded-lg bg-green-100 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Featured</p>
                            <p className="text-2xl font-bold text-yellow-600">{projects.filter((p) => p.is_featured).length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">★</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}>
                                <Grid className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}>
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                        <button onClick={() => { setSelectedProject(null); setIsModalOpen(true); }} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg text-sm">
                            <Plus className="w-4 h-4 mr-2" />Add Project
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg">
                        <Plus className="w-4 h-4 inline mr-2" />Add Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 relative">
                                {project.image_url ? (
                                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><FolderOpen className="w-16 h-16 text-green-300" /></div>
                                )}
                                {project.is_featured && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">Featured</div>
                                )}
                                {project.project_url && (
                                    <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 truncate">{project.title || 'Untitled'}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{project.description || 'No description'}</p>
                                {project.client_name && <p className="text-xs text-gray-400 mt-2">Client: {project.client_name}</p>}
                                <div className="flex items-center justify-between pt-3 mt-3 border-t">
                                    <span className="text-xs text-gray-400">{project.updated_at && format(new Date(project.updated_at), 'MMM dd')}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setSelectedProject(project); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProjectModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedProject(null); }} onSubmit={handleSubmit} project={selectedProject} />
        </CustomerLayout>
    );
};

export default CustomerProjects;
