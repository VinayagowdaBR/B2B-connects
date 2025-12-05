import { X, User, Mail, Phone, FileText, Paperclip, Calendar, Building2, Tag } from 'lucide-react';
import { format } from 'date-fns';

const InquiryDetailModal = ({ isOpen, onClose, inquiry }) => {
  if (!isOpen || !inquiry) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
            <p className="text-sm text-gray-500">
              Inquiry ID: #{inquiry.id} | Tenant: #{inquiry.tenant_id}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Status & Date */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(inquiry.status)}`}>
                  {inquiry.status?.replace('_', ' ').toUpperCase() || 'NEW'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {format(new Date(inquiry.created_at), 'MMM dd, yyyy hh:mm a')}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${inquiry.email}`} className="text-sm font-medium text-indigo-600 hover:underline">
                    {inquiry.email}
                  </a>
                </div>
              </div>

              {inquiry.phone && (
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <a href={`tel:${inquiry.phone}`} className="text-sm font-medium text-gray-900">
                      {inquiry.phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Company/Tenant</p>
                  <p className="text-sm font-medium text-gray-900">Tenant #{inquiry.tenant_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject */}
          {inquiry.subject && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Subject</h3>
              <p className="text-gray-900 font-medium">{inquiry.subject}</p>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Message</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>

          {/* Attachment */}
          {inquiry.attachment_url && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Attachment</h3>
              <a
                href={inquiry.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
                <span className="text-sm font-medium">View Attachment</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailModal;
