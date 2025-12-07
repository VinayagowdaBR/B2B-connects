import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import TestimonialModal from '@/components/customer/modals/TestimonialModal';
import { customerTestimonialsApi } from '@/api/endpoints/customer/testimonials';
import { MessageCircle, Plus, Search, Edit, Trash2, Star, Quote } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        try {
            setIsLoading(true);
            const data = await customerTestimonialsApi.getMyTestimonials();
            // Map backend fields
            const mapped = (data || []).map(t => ({
                ...t,
                client_name: t.client_name,
                client_company: t.client_company,
                client_designation: t.client_designation,
                content: t.content,
                rating: t.rating,
                client_image_url: t.client_image_url,
                is_active: t.publish_to_portfolio ?? true,
                is_featured: t.is_featured ?? false
            }));
            setTestimonials(mapped);
        } catch (e) {
            console.error(e);
            toast.error('Failed to load testimonials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data) => {
        try {
            // Map frontend to backend
            const payload = {
                client_name: data.client_name,
                client_designation: data.client_designation,
                client_company: data.client_company,
                content: data.content,
                rating: data.rating,
                client_image_url: data.client_image_url,
                is_featured: data.is_featured,
                publish_to_portfolio: data.is_active
            };

            if (selectedTestimonial) {
                await customerTestimonialsApi.updateTestimonial(selectedTestimonial.id, payload);
                toast.success('Updated!');
            } else {
                await customerTestimonialsApi.createTestimonial(payload);
                toast.success('Created!');
            }
            setIsModalOpen(false);
            fetchTestimonials();
        } catch (e) {
            console.error(e);
            toast.error('Failed to save');
            // throw e; 
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete?')) return;
        try { await customerTestimonialsApi.deleteTestimonial(id); toast.success('Deleted!'); fetchTestimonials(); } catch (e) { toast.error('Failed'); }
    };

    const filtered = testimonials.filter((t) => t.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) || t.content?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <CustomerLayout title="Testimonials" subtitle="Client feedback and reviews">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search testimonials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" />
                    </div>
                    <button onClick={() => { setSelectedTestimonial(null); setIsModalOpen(true); }} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg text-sm">
                        <Plus className="w-4 h-4 mr-2" />Add Testimonial
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No testimonials</h3>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg"><Plus className="w-4 h-4 inline mr-2" />Add</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((t) => (
                        <div key={t.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
                            <Quote className="w-8 h-8 text-teal-200 mb-4" />
                            <p className="text-gray-700 line-clamp-4 mb-4">{t.content || 'No content'}</p>
                            <div className="flex items-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold mr-3">
                                        {t.client_name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{t.client_name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500">{t.client_company || t.client_designation || ''}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TestimonialModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedTestimonial(null); }} onSubmit={handleSubmit} testimonial={selectedTestimonial} />
        </CustomerLayout>
    );
};

export default CustomerTestimonials;
