import { useState, useEffect } from 'react';
import { X, Briefcase, Save, MapPin, DollarSign } from 'lucide-react';

const CareerModal = ({ isOpen, onClose, onSubmit, career }) => {
    const [formData, setFormData] = useState({ title: '', department: '', description: '', requirements: '', location: '', employment_type: '', salary_range: '', experience_level: '', application_deadline: '', is_active: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (career) setFormData({ title: career.title || '', department: career.department || '', description: career.description || '', requirements: career.requirements || '', location: career.location || '', employment_type: career.employment_type || '', salary_range: career.salary_range || '', experience_level: career.experience_level || '', application_deadline: career.application_deadline || '', is_active: career.is_active ?? true });
        else setFormData({ title: '', department: '', description: '', requirements: '', location: '', employment_type: '', salary_range: '', experience_level: '', application_deadline: '', is_active: true });
    }, [career, isOpen]);

    const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); try { setIsSubmitting(true); await onSubmit(formData); } finally { setIsSubmitting(false); } };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b z-10">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mr-3"><Briefcase className="w-5 h-5 text-white" /></div>
                            <h2 className="text-lg font-bold">{career ? 'Edit Job' : 'Post New Job'}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Job Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg" placeholder="e.g., Senior Developer" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Engineering" /></div>
                            <div><label className="block text-sm font-medium mb-1"><MapPin className="w-4 h-4 inline mr-1" />Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Remote / City" /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Job Description *</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Describe the role..." /></div>
                        <div><label className="block text-sm font-medium mb-1">Requirements</label><textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Skills and qualifications..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Employment Type</label><select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg"><option value="">Select</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option><option value="Internship">Internship</option></select></div>
                            <div><label className="block text-sm font-medium mb-1">Experience</label><select name="experience_level" value={formData.experience_level} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg"><option value="">Select</option><option value="Entry">Entry Level</option><option value="Mid">Mid Level</option><option value="Senior">Senior</option><option value="Lead">Lead</option></select></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1"><DollarSign className="w-4 h-4 inline mr-1" />Salary Range</label><input type="text" name="salary_range" value={formData.salary_range} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="₹10L - ₹20L" /></div>
                            <div><label className="block text-sm font-medium mb-1">Deadline</label><input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2 w-4 h-4 text-teal-600 rounded" />Active (accepting applications)</label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg disabled:opacity-50"><Save className="w-4 h-4 mr-2" />{isSubmitting ? 'Saving...' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CareerModal;
