import { useState, useEffect } from 'react';
import { X, Loader2, User, Package, Calendar } from 'lucide-react';

const AssignSubscriptionModal = ({ isOpen, onClose, onSubmit, plans, customers }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_id: '',
    duration_days: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        customer_id: customers.length > 0 ? customers[0].id : '',
        plan_id: plans.length > 0 ? plans[0].id : '',
        duration_days: null,
      });
    }
  }, [isOpen, plans, customers]);

  useEffect(() => {
    if (formData.plan_id) {
      const plan = plans.find((p) => p.id === parseInt(formData.plan_id));
      setSelectedPlan(plan);
      if (plan && !formData.duration_days) {
        setFormData((prev) => ({ ...prev, duration_days: plan.duration_days }));
      }
    }
  }, [formData.plan_id, plans]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        customer_id: parseInt(formData.customer_id),
        plan_id: parseInt(formData.plan_id),
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
      };
      await onSubmit(submitData);
      setFormData({ customer_id: '', plan_id: '', duration_days: null });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Assign Subscription</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">Choose a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.email || customer.phone_number} - ID: {customer.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plan Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Plan *</label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.plan_id}
                onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none"
              >
                <option value="">Choose a plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.currency} {plan.price} / {plan.duration_days} days
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Plan Details Preview */}
          {selectedPlan && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <h4 className="text-sm font-semibold text-indigo-900 mb-2">Plan Details</h4>
              <div className="space-y-1 text-xs text-indigo-700">
                <p><strong>Price:</strong> {selectedPlan.currency} {selectedPlan.price}</p>
                <p><strong>Default Duration:</strong> {selectedPlan.duration_days} days</p>
                {selectedPlan.trial_days > 0 && (
                  <p><strong>Trial Period:</strong> {selectedPlan.trial_days} days</p>
                )}
              </div>
            </div>
          )}

          {/* Custom Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Duration (Optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.duration_days || ''}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                placeholder={`Default: ${selectedPlan?.duration_days || 30} days`}
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use plan's default duration
            </p>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This will create or replace the customer's current subscription with the selected plan.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
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
                  <span>Assigning...</span>
                </>
              ) : (
                <span>Assign Subscription</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignSubscriptionModal;
