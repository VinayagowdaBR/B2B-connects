import { useState, useEffect } from 'react';
import { X, Images, Save, Image as ImageIcon } from 'lucide-react';

const GalleryImageModal = ({ isOpen, onClose, onSubmit, image }) => {
    const [formData, setFormData] = useState({ title: '', description: '', image_url: '', category: '', alt_text: '', display_order: 0, is_active: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (image) setFormData({ title: image.title || '', description: image.description || '', image_url: image.image_url || '', category: image.category || '', alt_text: image.alt_text || '', display_order: image.display_order || 0, is_active: image.is_active ?? true });
        else setFormData({ title: '', description: '', image_url: '', category: '', alt_text: '', display_order: 0, is_active: true });
    }, [image, isOpen]);

    const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); try { setIsSubmitting(true); await onSubmit(formData); } finally { setIsSubmitting(false); } };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between p-6 border-b">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mr-3"><Images className="w-5 h-5 text-white" /></div>
                            <h2 className="text-lg font-bold">{image ? 'Edit Image' : 'Add Image'}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium mb-1"><ImageIcon className="w-4 h-4 inline mr-1" />Image URL *</label><input type="url" name="image_url" value={formData.image_url} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://example.com/image.jpg" /></div>
                        {formData.image_url && (
                            <div className="rounded-lg overflow-hidden border"><img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover" onError={(e) => e.target.style.display = 'none'} /></div>
                        )}
                        <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Image title" /></div>
                        <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Optional description..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg"><option value="">Select</option><option value="Work">Work</option><option value="Team">Team</option><option value="Event">Event</option><option value="Product">Product</option><option value="Office">Office</option><option value="Other">Other</option></select></div>
                            <div><label className="block text-sm font-medium mb-1">Order</label><input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Alt Text (SEO)</label><input type="text" name="alt_text" value={formData.alt_text} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Describe the image" /></div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2 w-4 h-4 text-teal-600 rounded" />Show in gallery</label>
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

export default GalleryImageModal;
