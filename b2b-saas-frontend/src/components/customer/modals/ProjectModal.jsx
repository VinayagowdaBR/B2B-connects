import { useState, useEffect } from 'react';
import { X, FolderOpen, Save, Image as ImageIcon, ExternalLink } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, onSubmit, project }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', client_name: '', category: '', image_url: '', project_url: '', technologies: '', start_date: '', end_date: '', is_active: true, is_featured: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (project) {
            // Technologies might come as array from backend (if mapped correctly in parent but not stringified there) 
            // OR parent might pass it as string.
            // Based on parent logic:
            // "technologies: JSON.stringify(project.technologies || []).replace..."
            // So it acts as a string in the parent's object passed here.

            setFormData({
                title: project.title || '',
                description: project.description || '',
                client_name: project.client_name || '',
                category: project.category || '',
                image_url: project.image_url || '',
                project_url: project.project_url || '',
                technologies: project.technologies || '',
                start_date: project.start_date ? project.start_date.split('T')[0] : '',
                end_date: project.end_date ? project.end_date.split('T')[0] : '',
                is_active: project.is_active ?? true,
                is_featured: project.is_featured ?? false
            });
        } else {
            setFormData({ title: '', description: '', client_name: '', category: '', image_url: '', project_url: '', technologies: '', start_date: '', end_date: '', is_active: true, is_featured: false });
        }
    }, [project, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { setIsSubmitting(true); await onSubmit(formData); } finally { setIsSubmitting(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b z-10">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mr-3"><FolderOpen className="w-5 h-5 text-white" /></div>
                            <div><h2 className="text-lg font-bold text-gray-900">{project ? 'Edit Project' : 'Add Project'}</h2></div>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="e.g., E-commerce Website" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Project details..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label><input type="text" name="client_name" value={formData.client_name} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Client name" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg"><option value="">Select</option><option value="Web Development">Web Development</option><option value="Mobile App">Mobile App</option><option value="Design">Design</option><option value="Marketing">Marketing</option><option value="Other">Other</option></select></div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label><input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="React, Node.js, MongoDB" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" name="end_date" value={formData.end_date} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                        </div>
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <ImageIcon className="w-4 h-4 inline mr-1" />
                                Project Image
                            </label>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            try {
                                                setIsSubmitting(true);
                                                const formData = new FormData();
                                                formData.append('file', file);

                                                const response = await fetch('http://localhost:8000/upload/', {
                                                    method: 'POST',
                                                    body: formData,
                                                });

                                                if (!response.ok) throw new Error('Upload failed');

                                                const data = await response.json();
                                                handleChange({ target: { name: 'image_url', value: data.url } });
                                            } catch (error) {
                                                console.error("Upload error:", error);
                                                alert("Image upload failed");
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-teal-50 file:text-teal-700
                                            hover:file:bg-teal-100
                                        "
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-2 bg-white text-sm text-gray-500">Or use URL</span>
                                    </div>
                                </div>

                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border rounded-lg"
                                    placeholder="https://example.com/project.jpg"
                                />
                            </div>

                            {formData.image_url && (
                                <div className="mt-2">
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        className="h-20 w-32 object-cover rounded-lg border"
                                        onError={(e) => (e.target.style.display = 'none')}
                                    />
                                </div>
                            )}
                        </div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1"><ExternalLink className="w-4 h-4 inline mr-1" />Project URL</label><input type="url" name="project_url" value={formData.project_url} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://..." /></div>
                        <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                            <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2 w-4 h-4 text-teal-600 rounded" />Active</label>
                            <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="mr-2 w-4 h-4 text-yellow-600 rounded" />Featured</label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg disabled:opacity-50"><Save className="w-4 h-4 mr-2" />{isSubmitting ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
