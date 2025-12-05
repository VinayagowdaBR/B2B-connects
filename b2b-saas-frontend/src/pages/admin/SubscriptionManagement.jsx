import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import PlanModal from '@/components/admin/PlanModal';
import PlanCard from '@/components/admin/PlanCard';
import AssignSubscriptionModal from '@/components/admin/AssignSubscriptionModal';
import { subscriptionsApi } from '@/api/endpoints/subscriptions';
import { usersApi } from '@/api/endpoints/users';
import {
  CreditCard,
  Plus,
  Search,
  Package,
  Users,
  RefreshCw,
  XCircle,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'subscriptions'
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [plansData, subsData, customersData] = await Promise.all([
        subscriptionsApi.getPlans(),
        subscriptionsApi.getCustomerSubscriptions(),
        usersApi.getUsers(),
      ]);
      setPlans(plansData);
      setSubscriptions(subsData);
      setCustomers(customersData.filter((u) => u.user_type === 'customer'));
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ PLAN HANDLERS ============

  const handleCreatePlan = async (planData) => {
    try {
      await subscriptionsApi.createPlan(planData);
      toast.success('Plan created successfully!');
      fetchData();
      setIsPlanModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create plan');
      throw error;
    }
  };

  const handleUpdatePlan = async (planData) => {
    try {
      await subscriptionsApi.updatePlan(selectedPlan.id, planData);
      toast.success('Plan updated successfully!');
      fetchData();
      setIsPlanModalOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update plan');
      throw error;
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to deactivate this plan?')) return;

    try {
      await subscriptionsApi.deletePlan(planId);
      toast.success('Plan deactivated successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete plan');
    }
  };

  const handleSetDefaultPlan = async (planId) => {
    try {
      await subscriptionsApi.setDefaultPlan(planId);
      toast.success('Default plan updated!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to set default plan');
    }
  };

  // ============ SUBSCRIPTION HANDLERS ============

  const handleAssignSubscription = async (data) => {
    try {
      await subscriptionsApi.assignSubscription(data);
      toast.success('Subscription assigned successfully!');
      fetchData();
      setIsAssignModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to assign subscription');
      throw error;
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      await subscriptionsApi.cancelSubscription(subscriptionId);
      toast.success('Subscription cancelled!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to cancel subscription');
    }
  };

  const handleRenewSubscription = async (subscriptionId) => {
    try {
      await subscriptionsApi.renewSubscription(subscriptionId);
      toast.success('Subscription renewed!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to renew subscription');
    }
  };

  // Filters
  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.tenant_id.toString().includes(searchQuery)
  );

  // Stats
  const totalRevenue = subscriptions
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (s.plan?.price || 0), 0);
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'ACTIVE').length;
  const expiringSoon = subscriptions.filter(
    (s) => s.status === 'ACTIVE' && s.days_remaining <= 7
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-sm text-gray-500">Manage plans and customer subscriptions</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setIsPlanModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-2 font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Plan</span>
              </button>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2 font-medium shadow-lg"
              >
                <Users className="w-5 h-5" />
                <span>Assign Subscription</span>
              </button>
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
                  <p className="text-sm font-medium text-gray-600">Total Plans</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{plans.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeSubscriptions}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">₹{totalRevenue}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{expiringSoon}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('plans')}
                className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'plans'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Subscription Plans ({plans.length})
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'subscriptions'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                Customer Subscriptions ({subscriptions.length})
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'plans' ? 'Search plans...' : 'Search by tenant ID...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tab Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Plans Tab */}
              {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onEdit={(p) => {
                        setSelectedPlan(p);
                        setIsPlanModalOpen(true);
                      }}
                      onDelete={handleDeletePlan}
                      onSetDefault={handleSetDefaultPlan}
                    />
                  ))}
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tenant ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Days Left
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{sub.tenant_id}</div>
                            <div className="text-xs text-gray-500">Sub ID: {sub.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{sub.plan?.name}</div>
                            <div className="text-xs text-gray-500">
                              {sub.plan?.currency} {sub.plan?.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(new Date(sub.start_date), 'MMM dd')} -{' '}
                                {format(new Date(sub.end_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                sub.status === 'ACTIVE'
                                  ? 'bg-green-100 text-green-800'
                                  : sub.status === 'TRIAL'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`text-sm font-medium ${
                                sub.days_remaining <= 7 ? 'text-red-600' : 'text-gray-700'
                              }`}
                            >
                              {sub.days_remaining} days
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleRenewSubscription(sub.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Renew"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelSubscription(sub.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={selectedPlan ? handleUpdatePlan : handleCreatePlan}
        plan={selectedPlan}
      />

      <AssignSubscriptionModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignSubscription}
        plans={plans.filter((p) => p.is_active)}
        customers={customers}
      />
    </div>
  );
};

export default SubscriptionManagement;
