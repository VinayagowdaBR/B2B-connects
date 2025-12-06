import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import GalleryImageModal from '@/components/customer/modals/GalleryImageModal';
import { customerGalleryApi } from '@/api/endpoints/customer/gallery';
import { Images, Plus, Search, Edit, Trash2, ZoomIn, X, Grid, List } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomerGallery = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => { fetchImages(); }, []);

    const fetchImages = async () => {
        try { setIsLoading(true); const data = await customerGalleryApi.getMyGalleryImages(); setImages(data || []); } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedImage) { await customerGalleryApi.updateGalleryImage(selectedImage.id, data); toast.success('Updated!'); }
            else { await customerGalleryApi.createGalleryImage(data); toast.success('Added!'); }
            setIsModalOpen(false); fetchImages();
        } catch (e) { toast.error('Failed'); throw e; }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try { await customerGalleryApi.deleteGalleryImage(id); toast.success('Deleted!'); fetchImages(); } catch (e) { toast.error('Failed'); }
    };

    const filtered = images.filter((img) => img.title?.toLowerCase().includes(searchQuery.toLowerCase()) || img.category?.toLowerCase().includes(searchQuery.toLowerCase()));
    const categories = [...new Set(images.map((img) => img.category).filter(Boolean))];

    return (
        <CustomerLayout title="Image Gallery" subtitle="Manage your portfolio images">
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search images..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" />
                        </div>
                    </div>
                    <button onClick={() => { setSelectedImage(null); setIsModalOpen(true); }} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg text-sm">
                        <Plus className="w-4 h-4 mr-2" />Add Image
                    </button>
                </div>
            </div>

            {/* Category Pills */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setSearchQuery('')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!searchQuery ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setSearchQuery(cat)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${searchQuery === cat ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No images</h3>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg"><Plus className="w-4 h-4 inline mr-2" />Add Image</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filtered.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm border hover:shadow-lg transition-shadow">
                            {img.image_url ? (
                                <img src={img.image_url} alt={img.title || 'Gallery'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><Images className="w-12 h-12 text-gray-300" /></div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => setLightboxImage(img)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"><ZoomIn className="w-5 h-5" /></button>
                                <button onClick={() => { setSelectedImage(img); setIsModalOpen(true); }} className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"><Edit className="w-5 h-5" /></button>
                                <button onClick={() => handleDelete(img.id)} className="p-2 bg-white/20 hover:bg-red-500/50 rounded-full text-white"><Trash2 className="w-5 h-5" /></button>
                            </div>
                            {img.title && (
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white text-xs truncate">{img.title}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
                    <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full"><X className="w-6 h-6" /></button>
                    <img src={lightboxImage.image_url} alt={lightboxImage.title} className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                    {lightboxImage.title && <p className="absolute bottom-4 text-white text-lg">{lightboxImage.title}</p>}
                </div>
            )}

            <GalleryImageModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedImage(null); }} onSubmit={handleSubmit} image={selectedImage} />
        </CustomerLayout>
    );
};

export default CustomerGallery;
