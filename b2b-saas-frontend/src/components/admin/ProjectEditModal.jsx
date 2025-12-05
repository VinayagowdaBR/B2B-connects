import { useState, useEffect } from 'react';
import { X, Loader2, FolderOpen, FileText, Image, Link as LinkIcon, Calendar, Tag } from 'lucide-react';

const ProjectEditModal = ({ isOpen, onClose, onSubmit, project }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    client_name: '',
    category: '',
    tags: '',
    featured_image: '',
    images: [],
    project_url: '',
    completion_date: '',
    technologies: '',
    challenges: '',
    solutions: '',
    results: '',
    is_featured: false,
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        short_description: project.short_description || '',
        client_name: project.client_name || '',
        category: project.category || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        featured_image: project.featured_image || '',
        images: Array.isArray(project.images) ? project.images : [],
        project_url: project.project_url || '',
        completion_date: project.completion_date ? project.completion_date.split('T')[0] : '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || '',
        challenges: project.challenges || '',
        solutions: project.solutions || '',
        results: project.results || '',
        is_featured: project.is_featured || false,
        is_active: project.is_active ?? true,
      });
    }
  }, [project, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
            <p className="text-sm text-gray-500">
              Tenant ID: {project?.tenant_id} | Project ID: {project?.id}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., E-commerce Platform Redesign"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Company ABC"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Web Development"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.completion_date}
                    onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    placeholder="https://project.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Description</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief project overview..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed project description..."
                  rows={5}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://example.com/project.jpg"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma-separated)</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="web, ecommerce, responsive"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Challenges</label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                placeholder="What challenges were faced..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solutions</label>
              <textarea
                value={formData.solutions}
                onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
                placeholder="How challenges were solved..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results</label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                placeholder="Project outcomes and impact..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Status Toggles */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_featured_project"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <label htmlFor="is_featured_project" className="text-sm font-medium text-gray-700 cursor-pointer">
                Featured Project (showcase prominently)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active_project"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <label htmlFor="is_active_project" className="text-sm font-medium text-gray-700 cursor-pointer">
                Active Project (visible to customers)
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Update Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditModal;
