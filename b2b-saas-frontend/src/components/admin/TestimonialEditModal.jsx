import { useState, useEffect } from 'react';
import { X, Loader2, MessageSquare, User, Briefcase, Star, Image } from 'lucide-react';

const TestimonialEditModal = ({ isOpen, onClose, onSubmit, testimonial }) => {
  const [formData, setFormData] = useState({
    author_name: '',
    author_position: '',
    author_company: '',
    author_image: '',
    content: '',
    rating: 5,
    is_featured: false,
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        author_name: testimonial.author_name || '',
        author_position: testimonial.author_position || '',
        author_company: testimonial.author_company || '',
        author_image: testimonial.author_image || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        is_featured: testimonial.is_featured || false,
        is_active: testimonial.is_active ?? true,
      });
    }
  }, [testimonial, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ ...formData, rating: parseInt(formData.rating) });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Testimonial</h2>
            <p className="text-sm text-gray-500">
              Tenant ID: {testimonial?.tenant_id} | Testimonial ID: {testimonial?.id}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Author Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Author Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.author_position}
                    onChange={(e) => setFormData({ ...formData, author_position: e.target.value })}
                    placeholder="CEO"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.author_company}
                  onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Image URL</label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.author_image}
                  onChange={(e) => setFormData({ ...formData, author_image: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Testimonial Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the testimonial here..."
                  required
                  rows={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating * (1-5 stars)
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    min="1"
                    max="5"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Status Toggles */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_featured_testimonial"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <label htmlFor="is_featured_testimonial" className="text-sm font-medium text-gray-700 cursor-pointer">
                Featured Testimonial (display prominently)
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active_testimonial"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <label htmlFor="is_active_testimonial" className="text-sm font-medium text-gray-700 cursor-pointer">
                Active Testimonial (visible to customers)
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
                <span>Update Testimonial</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialEditModal;
