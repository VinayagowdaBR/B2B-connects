import { useState, useEffect } from 'react';
import { X, UserCheck, Save, Linkedin, Twitter, Mail } from 'lucide-react';

const TeamMemberModal = ({ isOpen, onClose, onSubmit, member }) => {
    const [formData, setFormData] = useState({ name: '', position: '', bio: '', email: '', phone: '', image_url: '', linkedin_url: '', twitter_url: '', display_order: 0, is_active: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (member) setFormData({ name: member.name || '', position: member.position || '', bio: member.bio || '', email: member.email || '', phone: member.phone || '', image_url: member.image_url || '', linkedin_url: member.linkedin_url || '', twitter_url: member.twitter_url || '', display_order: member.display_order || 0, is_active: member.is_active ?? true });
        else setFormData({ name: '', position: '', bio: '', email: '', phone: '', image_url: '', linkedin_url: '', twitter_url: '', display_order: 0, is_active: true });
    }, [member, isOpen]);

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
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3"><UserCheck className="w-5 h-5 text-white" /></div>
                            <h2 className="text-lg font-bold">{member ? 'Edit Member' : 'Add Member'}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Full Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg" placeholder="John Doe" /></div>
                        <div><label className="block text-sm font-medium mb-1">Position *</label><input type="text" name="position" value={formData.position} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg" placeholder="CEO & Founder" /></div>
                        <div><label className="block text-sm font-medium mb-1">Bio</label><textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Short bio..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1"><Mail className="w-4 h-4 inline mr-1" />Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="john@company.com" /></div>
                            <div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="+91..." /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Photo URL</label><input type="url" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1"><Linkedin className="w-4 h-4 inline mr-1" />LinkedIn</label><input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://linkedin.com/in/..." /></div>
                            <div><label className="block text-sm font-medium mb-1"><Twitter className="w-4 h-4 inline mr-1" />Twitter</label><input type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://twitter.com/..." /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="0" /></div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2 w-4 h-4 text-teal-600 rounded" />Show on portfolio</label>
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

export default TeamMemberModal;
