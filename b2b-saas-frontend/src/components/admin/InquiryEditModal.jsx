import { useState, useEffect } from 'react';
import { X, Loader2, Tag } from 'lucide-react';

const InquiryEditModal = ({ isOpen, onClose, onSubmit, inquiry }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    attachment_url: '',
    status: 'new',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inquiry) {
      setFormData({
        name: inquiry.name || '',
        email: inquiry.email || '',
        phone: inquiry.phone || '',
        subject: inquiry.subject || '',
        message: inquiry.message || '',
        attachment_url: inquiry.attachment_url || '',
        status: inquiry.status || 'new',
      });
    }
  }, [inquiry, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Update Inquiry Status</h2>
            <p className="text-sm text-gray-500">Inquiry ID: #{inquiry?.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Update the inquiry status for tracking</p>
          </div>

          {/* Status Description */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-xs">
            <p><span className="font-semibold text-blue-600">New:</span> Inquiry just received</p>
            <p><span className="font-semibold text-yellow-600">In Progress:</span> Currently being handled</p>
            <p><span className="font-semibold text-green-600">Resolved:</span> Issue has been resolved</p>
            <p><span className="font-semibold text-gray-600">Closed:</span> Inquiry is closed</p>
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
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Status</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryEditModal;
