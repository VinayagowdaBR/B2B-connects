import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import GalleryEditModal from '@/components/admin/GalleryEditModal';
import ImageLightbox from '@/components/admin/ImageLightbox';
import { adminGalleryApi } from '@/api/endpoints/adminGallery';
import {
  Images,
  Search,
  Edit,
  Trash2,
  Building2,
  Filter,
  Tag,
  Calendar,
  Eye,
  Grid3x3,
  LayoutGrid,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyGalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTenant, setFilterTenant] = useState('');
  const [viewMode, setViewMode] = useState('masonry'); // 'masonry' or 'grid'

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const data = await adminGalleryApi.getAllGalleryImages();
      setImages(data);
    } catch (error) {
      toast.error('Failed to fetch gallery images');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminGalleryApi.updateGalleryImage(selectedImage.id, data);
      toast.success('Image updated successfully!');
      fetchImages();
      setIsEditModalOpen(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update image');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await adminGalleryApi.deleteGalleryImage(id);
      toast.success('Image deleted successfully!');
      fetchImages();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete image');
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setIsEditModalOpen(true);
  };

  const handleImageClick = (index) => {
    setCurrentLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Filter images
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.image_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !filterCategory || image.category === filterCategory;
    const matchesTenant = !filterTenant || image.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesCategory && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(images.map((i) => i.tenant_id))].sort((a, b) => a - b);
  const uniqueCategories = [...new Set(images.map((i) => i.category).filter(Boolean))];

  // Stats
  const totalImages = images.length;
  const uniqueCompanies = uniqueTenants.length;
  const categoriesCount = uniqueCategories.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-sm text-gray-500">Manage all customers' gallery images</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
                    viewMode === 'masonry'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Masonry</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-1 ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span>Grid</span>
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
                  <p className="text-sm font-medium text-gray-600">Total Images</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalImages}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Images className="w-6 h-6 text-white" />
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{categoriesCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Filtered</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{filteredImages.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-white" />
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
                placeholder="Search by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
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
                {filteredImages.length} of {totalImages} images
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No images found</p>
            </div>
          ) : (
            <>
              {/* Masonry View */}
              {viewMode === 'masonry' && (
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {filteredImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="break-inside-avoid bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-xl transition-all"
                    >
                      {/* Image */}
                      <div className="relative cursor-pointer" onClick={() => handleImageClick(index)}>
                        <img
                          src={image.image_url}
                          alt={image.image_title}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                        {/* Tenant Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                            #{image.tenant_id}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {image.image_title}
                        </h3>
                        
                        {image.category && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {image.category}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(image.created_at), 'MMM dd, yyyy')}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(image);
                            }}
                            className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(image.id);
                            }}
                            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-xl transition-all"
                    >
                      {/* Image - Fixed aspect ratio */}
                      <div
                        className="relative aspect-square cursor-pointer bg-gray-100"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={image.image_url}
                          alt={image.image_title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                        {/* Tenant Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                            #{image.tenant_id}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {image.image_title}
                        </h3>
                        
                        {image.category && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {image.category}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(image.created_at), 'MMM dd, yyyy')}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(image);
                            }}
                            className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(image.id);
                            }}
                            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <GalleryEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedImage(null);
        }}
        onSubmit={handleUpdate}
        image={selectedImage}
      />

      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={filteredImages}
        currentIndex={currentLightboxIndex}
        onNavigate={setCurrentLightboxIndex}
      />
    </div>
  );
};

export default CompanyGalleryManagement;
