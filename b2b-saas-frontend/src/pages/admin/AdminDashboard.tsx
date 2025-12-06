import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
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
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Customers',
      value: '1,234',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Subscriptions',
      value: '892',
      change: '+8.2%',
      isPositive: true,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+23.1%',
      isPositive: true,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Active Companies',
      value: '567',
      change: '-2.4%',
      isPositive: false,
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
    },
  ]);

  const headerActions = (
    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
      Generate Report
    </button>
  );

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back, Admin!"
      headerActions={headerActions}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
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
            <div className="h-64 flex items-center justify-center text-gray-400">
              {/* Placeholder for chart library (recharts/chart.js) */}
              <div className="text-center">
                <Activity className="w-16 h-16 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Chart will be displayed here</p>
              </div>
            </div>
          </div>

          {/* Subscription Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h2>
            <div className="space-y-4">
              {[
                { name: 'Basic Plan', count: 234, percentage: 26, color: 'bg-blue-500' },
                { name: 'Pro Plan', count: 456, percentage: 51, color: 'bg-purple-500' },
                { name: 'Enterprise', count: 202, percentage: 23, color: 'bg-indigo-500' },
              ].map((plan, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{plan.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{plan.count}</span>
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
          </div>
        </div>

        {/* Recent Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Customers</h2>
          </div>
          <div className="overflow-x-auto -mx-px">
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
                {[
                  {
                    name: 'Tech Solutions Inc.',
                    email: 'contact@techsolutions.com',
                    plan: 'Pro',
                    status: 'Active',
                    date: '2 days ago',
                  },
                  {
                    name: 'Digital Marketing Co.',
                    email: 'info@digitalmarketing.com',
                    plan: 'Enterprise',
                    status: 'Active',
                    date: '3 days ago',
                  },
                  {
                    name: 'Startup Labs',
                    email: 'hello@startuplabs.com',
                    plan: 'Basic',
                    status: 'Trial',
                    date: '5 days ago',
                  },
                ].map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {customer.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
