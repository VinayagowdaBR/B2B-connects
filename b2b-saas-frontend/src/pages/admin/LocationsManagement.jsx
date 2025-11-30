import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import StateModal from '@/components/admin/StateModal';
import DistrictModal from '@/components/admin/DistrictModal';
import { locationsApi } from '@/api/endpoints/locations';
import {
  MapPin,
  Plus,
  Search,
  Edit,
  Trash2,
  Map,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';

const LocationsManagement = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('states'); // 'states' or 'districts'
  
  // State Modal
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  
  // District Modal
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStateId, setFilterStateId] = useState(null);
  const [expandedStates, setExpandedStates] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statesData, districtsData] = await Promise.all([
        locationsApi.getStates(),
        locationsApi.getDistricts(),
      ]);
      setStates(statesData);
      setDistricts(districtsData);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ STATE HANDLERS ============
  
  const handleCreateState = async (stateData) => {
    try {
      await locationsApi.createState(stateData);
      toast.success('State created successfully!');
      fetchData();
      setIsStateModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create state');
      throw error;
    }
  };

  const handleUpdateState = async (stateData) => {
    try {
      await locationsApi.updateState(selectedState.id, stateData);
      toast.success('State updated successfully!');
      fetchData();
      setIsStateModalOpen(false);
      setSelectedState(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update state');
      throw error;
    }
  };

  const handleDeleteState = async (stateId) => {
    if (!window.confirm('Are you sure you want to delete this state? This will also affect its districts.')) return;

    try {
      await locationsApi.deleteState(stateId);
      toast.success('State deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete state');
    }
  };

  // ============ DISTRICT HANDLERS ============
  
  const handleCreateDistrict = async (districtData) => {
    try {
      await locationsApi.createDistrict(districtData);
      toast.success('District created successfully!');
      fetchData();
      setIsDistrictModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create district');
      throw error;
    }
  };

  const handleUpdateDistrict = async (districtData) => {
    try {
      await locationsApi.updateDistrict(selectedDistrict.id, districtData);
      toast.success('District updated successfully!');
      fetchData();
      setIsDistrictModalOpen(false);
      setSelectedDistrict(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update district');
      throw error;
    }
  };

  const handleDeleteDistrict = async (districtId) => {
    if (!window.confirm('Are you sure you want to delete this district?')) return;

    try {
      await locationsApi.deleteDistrict(districtId);
      toast.success('District deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete district');
    }
  };

  // Toggle state expansion
  const toggleStateExpansion = (stateId) => {
    const newExpanded = new Set(expandedStates);
    if (newExpanded.has(stateId)) {
      newExpanded.delete(stateId);
    } else {
      newExpanded.add(stateId);
    }
    setExpandedStates(newExpanded);
  };

  // Filter states
  const filteredStates = states.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.prefix_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter districts
  const filteredDistricts = districts.filter((district) => {
    const matchesSearch = district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.prefix_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = !filterStateId || district.state_id === parseInt(filterStateId);
    return matchesSearch && matchesState;
  });

  // Get districts for a state
  const getDistrictsByState = (stateId) => {
    return districts.filter((d) => d.state_id === stateId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">States & Districts</h1>
              <p className="text-sm text-gray-500">Manage geographical locations</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedState(null);
                  setIsStateModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2 font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add State</span>
              </button>
              <button
                onClick={() => {
                  setSelectedDistrict(null);
                  setIsDistrictModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center space-x-2 font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add District</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('states')}
                className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'states'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                States ({states.length})
              </button>
              <button
                onClick={() => setActiveTab('districts')}
                className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'districts'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Map className="w-4 h-4 inline mr-2" />
                Districts ({districts.length})
              </button>
              <button
                onClick={() => setActiveTab('hierarchy')}
                className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'hierarchy'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Hierarchical View
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'districts' && (
              <div className="relative w-full sm:w-64">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStateId || ''}
                  onChange={(e) => setFilterStateId(e.target.value || null)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tab Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* States Tab */}
              {activeTab === 'states' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          State Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Prefix Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Districts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStates.map((state) => (
                        <tr key={state.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 text-indigo-500 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{state.name}</div>
                                <div className="text-xs text-gray-500">ID: {state.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                              {state.prefix_code}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {getDistrictsByState(state.id).length} districts
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                state.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {state.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedState(state);
                                  setIsStateModalOpen(true);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteState(state.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Districts Tab */}
              {activeTab === 'districts' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          District Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Prefix Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          State
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDistricts.map((district) => (
                        <tr key={district.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Map className="w-5 h-5 text-purple-500 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{district.name}</div>
                                <div className="text-xs text-gray-500">ID: {district.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {district.prefix_code}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {district.state?.name || 'N/A'} ({district.state?.prefix_code})
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                district.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {district.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedDistrict(district);
                                  setIsDistrictModalOpen(true);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteDistrict(district.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Hierarchical View */}
              {activeTab === 'hierarchy' && (
                <div className="space-y-4">
                  {filteredStates.map((state) => {
                    const stateDistricts = getDistrictsByState(state.id);
                    const isExpanded = expandedStates.has(state.id);

                    return (
                      <div key={state.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* State Header */}
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleStateExpansion(state.id)}
                        >
                          <div className="flex items-center space-x-3">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                            <MapPin className="w-6 h-6 text-indigo-500" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{state.name}</h3>
                              <p className="text-sm text-gray-500">
                                {state.prefix_code} • {stateDistricts.length} districts
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                state.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {state.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedState(state);
                                setIsStateModalOpen(true);
                              }}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Districts List */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 p-4 bg-gray-50">
                            {stateDistricts.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {stateDistricts.map((district) => (
                                  <div
                                    key={district.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <Map className="w-4 h-4 text-purple-500" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">{district.name}</p>
                                        <p className="text-xs text-gray-500">{district.prefix_code}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => {
                                          setSelectedDistrict(district);
                                          setIsDistrictModalOpen(true);
                                        }}
                                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteDistrict(district.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">No districts in this state</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <StateModal
        isOpen={isStateModalOpen}
        onClose={() => {
          setIsStateModalOpen(false);
          setSelectedState(null);
        }}
        onSubmit={selectedState ? handleUpdateState : handleCreateState}
        state={selectedState}
      />

      <DistrictModal
        isOpen={isDistrictModalOpen}
        onClose={() => {
          setIsDistrictModalOpen(false);
          setSelectedDistrict(null);
        }}
        onSubmit={selectedDistrict ? handleUpdateDistrict : handleCreateDistrict}
        district={selectedDistrict}
        states={states}
      />
    </div>
  );
};

export default LocationsManagement;
