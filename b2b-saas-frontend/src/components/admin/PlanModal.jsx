import { useState, useEffect } from 'react';
import { X, Loader2, Package, DollarSign, Calendar, Star, CheckCircle } from 'lucide-react';

const PlanModal = ({ isOpen, onClose, onSubmit, plan }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'INR',
    duration_days: 30,
    trial_days: 0,
    is_default: false,
    is_active: true,
    features: {
      max_blog_posts: 50,
      max_gallery_images: 100,
      max_products: 50,
      max_projects: 25,
      max_services: 10,
      max_team_members: 5,
      modules: [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const availableModules = [
    'blog',
    'gallery',
    'testimonials',
    'careers',
    'products',
    'services',
    'projects',
    'team',
    'inquiries',
  ];

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price || 0,
        currency: plan.currency || 'INR',
        duration_days: plan.duration_days || 30,
        trial_days: plan.trial_days || 0,
        is_default: plan.is_default || false,
        is_active: plan.is_active ?? true,
        features: plan.features || {
          max_blog_posts: 50,
          max_gallery_images: 100,
          max_products: 50,
          max_projects: 25,
          max_services: 10,
          max_team_members: 5,
          modules: [],
        },
      });
    }
  }, [plan, isOpen]);

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

  const toggleModule = (module) => {
    const modules = formData.features.modules || [];
    const newModules = modules.includes(module)
      ? modules.filter((m) => m !== module)
      : [...modules, module];
    setFormData({
      ...formData,
      features: { ...formData.features, modules: newModules },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {plan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Professional Plan"
                  required
                  maxLength={100}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this plan..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                  min="1"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trial Days</label>
              <input
                type="number"
                value={formData.trial_days}
                onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) })}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Features/Limits */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Limits</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Blog Posts</label>
                <input
                  type="number"
                  value={formData.features.max_blog_posts}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features, max_blog_posts: parseInt(e.target.value) || 0 },
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Gallery Images</label>
                <input
                  type="number"
                  value={formData.features.max_gallery_images}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features, max_gallery_images: parseInt(e.target.value) || 0 },
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Products</label>
                <input
                  type="number"
                  value={formData.features.max_products}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features, max_products: parseInt(e.target.value) || 0 },
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Projects</label>
                <input
                  type="number"
                  value={formData.features.max_projects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features, max_projects: parseInt(e.target.value) || 0 },
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Services</label>
                <input
                  type="number"
                  value={formData.features.max_services}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features, max_services: parseInt(e.target.value) || 0 },
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max Team Members</label>
                <input
                  type="number"
                  value={formData.features.max_team_members}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      features: { ...formData.features, max_team_members: parseInt(e.target.value) || 0 },
                    })
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enabled Modules</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableModules.map((module) => (
                <button
                  key={module}
                  type="button"
                  onClick={() => toggleModule(module)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium capitalize ${
                    formData.features.modules?.includes(module)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {formData.features.modules?.includes(module) && (
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                  )}
                  {module}
                </button>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-col space-y-3 border-t pt-4">
            <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-5 h-5 text-amber-600 border-gray-300 rounded mt-0.5"
              />
              <div>
                <label htmlFor="is_default" className="text-sm font-medium text-gray-900 flex items-center cursor-pointer">
                  <Star className="w-4 h-4 text-amber-500 mr-1" />
                  Set as Default Plan
                </label>
                <p className="text-xs text-gray-600 mt-1">New customers will be assigned this plan</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active Plan
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 border-t pt-4">
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
                <span>{plan ? 'Update Plan' : 'Create Plan'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;
