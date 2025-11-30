import { useState, useEffect } from 'react';
import { X, Loader2, MapPin, Hash, Map } from 'lucide-react';

const DistrictModal = ({ isOpen, onClose, onSubmit, district, states }) => {
  const [formData, setFormData] = useState({
    name: '',
    prefix_code: '',
    state_id: '',
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (district) {
      setFormData({
        name: district.name || '',
        prefix_code: district.prefix_code || '',
        state_id: district.state_id || '',
        is_active: district.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        prefix_code: '',
        state_id: states.length > 0 ? states[0].id : '',
        is_active: true,
      });
    }
  }, [district, isOpen, states]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        state_id: parseInt(formData.state_id),
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {district ? 'Edit District' : 'Create New District'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* District Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District Name *
            </label>
            <div className="relative">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mumbai"
                required
                maxLength={100}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Prefix Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prefix Code *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.prefix_code}
                onChange={(e) => setFormData({ ...formData, prefix_code: e.target.value.toUpperCase() })}
                placeholder="e.g., MUM"
                required
                maxLength={10}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">2-10 characters (will be uppercased)</p>
          </div>

          {/* State Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={formData.state_id}
                onChange={(e) => setFormData({ ...formData, state_id: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name} ({state.prefix_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="district_is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="district_is_active" className="text-sm font-medium text-gray-700">
              Active District
            </label>
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
                  <span>Saving...</span>
                </>
              ) : (
                <span>{district ? 'Update District' : 'Create District'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DistrictModal;
