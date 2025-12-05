import { Edit, Trash2, Star, CheckCircle, Calendar, DollarSign } from 'lucide-react';

const PlanCard = ({ plan, onEdit, onDelete, onSetDefault }) => {
  const formatCurrency = (amount, currency) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€' };
    return `${symbols[currency] || currency} ${amount}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all overflow-hidden">
      {/* Header */}
      <div className={`p-6 ${plan.is_default ? 'bg-gradient-to-br from-amber-50 to-yellow-50' : 'bg-gray-50'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              {plan.is_default && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  DEFAULT
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{plan.description || 'No description'}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-bold text-indigo-600">
            {formatCurrency(plan.price, plan.currency)}
          </span>
          <span className="text-gray-500">/ {plan.duration_days} days</span>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Plan Limits</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plan.features?.max_blog_posts || 0} Blog Posts</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plan.features?.max_products || 0} Products</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plan.features?.max_projects || 0} Projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plan.features?.max_services || 0} Services</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plan.features?.max_team_members || 0} Team Members</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{plan.features?.max_gallery_images || 0} Gallery Images</span>
          </div>
        </div>

        {/* Modules */}
        {plan.features?.modules && plan.features.modules.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Enabled Modules</h4>
            <div className="flex flex-wrap gap-2">
              {plan.features.modules.map((module) => (
                <span
                  key={module}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium capitalize"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Trial Period */}
        {plan.trial_days > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-green-800">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{plan.trial_days} days free trial</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {plan.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="text-xs text-gray-500">ID: {plan.id}</span>
        </div>

        <div className="flex space-x-2">
          {!plan.is_default && (
            <button
              onClick={() => onSetDefault(plan.id)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Set as default"
            >
              <Star className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(plan)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit plan"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(plan.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
