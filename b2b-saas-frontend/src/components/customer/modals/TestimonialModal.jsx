import { useState, useEffect } from 'react';
import { X, MessageCircle, Save, Star } from 'lucide-react';

const TestimonialModal = ({ isOpen, onClose, onSubmit, testimonial }) => {
    const [formData, setFormData] = useState({ client_name: '', client_company: '', client_designation: '', client_image_url: '', content: '', rating: 5, is_active: true });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (testimonial) setFormData({ client_name: testimonial.client_name || '', client_company: testimonial.client_company || '', client_designation: testimonial.client_designation || '', client_image_url: testimonial.client_image_url || '', content: testimonial.content || '', rating: testimonial.rating || 5, is_active: testimonial.is_active ?? true });
        else setFormData({ client_name: '', client_company: '', client_designation: '', client_image_url: '', content: '', rating: 5, is_active: true });
    }, [testimonial, isOpen]);

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
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mr-3"><MessageCircle className="w-5 h-5 text-white" /></div>
                            <h2 className="text-lg font-bold">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Client Name *</label><input type="text" name="client_name" value={formData.client_name} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg" placeholder="John Doe" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Company</label><input type="text" name="client_company" value={formData.client_company} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="Company Inc." /></div>
                            <div><label className="block text-sm font-medium mb-1">Designation</label><input type="text" name="client_designation" value={formData.client_designation} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="CEO" /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Testimonial Content *</label><textarea name="content" value={formData.content} onChange={handleChange} required rows={4} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="What the client said..." /></div>
                        <div><label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-1">{[1, 2, 3, 4, 5].map((r) => (<button type="button" key={r} onClick={() => setFormData((p) => ({ ...p, rating: r }))} className="p-1"><Star className={`w-6 h-6 ${r <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} /></button>))}</div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1">Client Image URL</label><input type="url" name="client_image_url" value={formData.client_image_url} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://..." /></div>
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

export default TestimonialModal;
