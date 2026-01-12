import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { adminApi } from '@/api/endpoints/admin';
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
  color: string;
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getDashboardStats();

      // Map API data to Stats Cards
      setStats([
        {
          title: 'Total Customers',
          value: data.total_customers.toLocaleString(),
          change: '+0%', // Dynamic change requires historical data, placeholder for now
          isPositive: true,
          icon: Users,
          color: 'from-blue-500 to-blue-600',
        },
        {
          title: 'Active Subscriptions',
          value: data.active_subscriptions.toLocaleString(),
          change: '+0%',
          isPositive: true,
          icon: CreditCard,
          color: 'from-green-500 to-green-600',
        },
        {
          title: 'Total Revenue',
          value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.total_revenue),
          change: '+0%',
          isPositive: true,
          icon: DollarSign,
          color: 'from-purple-500 to-purple-600',
        },
        {
          title: 'Active Companies',
          value: data.active_companies.toLocaleString(),
          change: '+0%',
          isPositive: false, // Just a visual placeholder
          icon: Building2,
          color: 'from-orange-500 to-orange-600',
        },
      ]);

      // Map Subscription Plans
      // Add colors dynamically
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-cyan-500'];
      const mappedPlans = data.subscription_distribution.map((plan, index) => ({
        ...plan,
        color: colors[index % colors.length]
      }));
      setSubscriptionPlans(mappedPlans);

      // Map Recent Customers
      setRecentCustomers(data.recent_customers);

    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const headerActions = (
    <button
      onClick={fetchDashboardData}
      disabled={isLoading}
      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
    >
      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back, Admin!"
      headerActions={headerActions}
    >
      {isLoading && stats.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    {/* 
                      <div className="flex items-center mt-2">
                        {stat.isPositive ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ml-1 ${stat.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                      */}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                {/* Placeholder for chart library (recharts/chart.js) */}
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Chart visualization coming soon</p>
                </div>
              </div>
            </div>

            {/* Subscription Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h2>
              {subscriptionPlans.length > 0 ? (
                <div className="space-y-4">
                  {subscriptionPlans.map((plan: any, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{plan.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{plan.count} ({plan.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${plan.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${plan.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No active subscriptions yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Customers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Customers</h2>
              <a href="/admin/users" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline">View All</a>
            </div>
            <div className="overflow-x-auto -mx-px">
              {recentCustomers.length > 0 ? (
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentCustomers.map((customer: any, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[150px]" title={customer.name}>{customer.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {customer.plan || 'Free'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${customer.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                                customer.status === 'Trial' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                  'bg-gray-100 text-gray-800 border-gray-200'
                              }`}
                          >
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.joined_at ? new Date(customer.joined_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No customers found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
