import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { customerSubscriptionApi } from '@/api/endpoints/customer/subscription';
import {
    CreditCard,
    Check,
    Crown,
    Zap,
    Calendar,
    Clock,
    ArrowRight,
    Download,
    Star,
    Shield,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerSubscription = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('plans');

    useEffect(() => {
        fetchSubscriptionData();
    }, []);

    const fetchSubscriptionData = async () => {
        try {
            setIsLoading(true);
            const [subscription, plans, payments] = await Promise.allSettled([
                customerSubscriptionApi.getMySubscription(),
                customerSubscriptionApi.getAvailablePlans(),
                customerSubscriptionApi.getPaymentHistory(),
            ]);

            if (subscription.status === 'fulfilled') {
                setCurrentPlan(subscription.value);
            }
            if (plans.status === 'fulfilled') {
                setAvailablePlans(plans.value || []);
            }
            if (payments.status === 'fulfilled') {
                setPaymentHistory(payments.value || []);
            }
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgrade = async (planId) => {
        try {
            await customerSubscriptionApi.upgradePlan({ plan_id: planId });
            toast.success('Plan upgrade initiated! You will be redirected to payment.');
            fetchSubscriptionData();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to upgrade plan');
        }
    };

    // Mock data for demo
    const mockPlans = [
        {
            id: 1,
            name: 'Starter',
            price: 0,
            period: 'month',
            description: 'Perfect for getting started',
            features: [
                '5 Services',
                '10 Products',
                '5 Projects',
                'Basic Portfolio',
                'Email Support',
            ],
            is_current: true,
        },
        {
            id: 2,
            name: 'Professional',
            price: 999,
            period: 'month',
            description: 'For growing businesses',
            features: [
                '25 Services',
                '50 Products',
                '25 Projects',
                'Premium Portfolio',
                'Priority Support',
                'Custom Domain',
                'Analytics Dashboard',
            ],
            is_popular: true,
        },
        {
            id: 3,
            name: 'Enterprise',
            price: 2499,
            period: 'month',
            description: 'For large organizations',
            features: [
                'Unlimited Services',
                'Unlimited Products',
                'Unlimited Projects',
                'White-label Portfolio',
                '24/7 Phone Support',
                'Custom Domain',
                'Advanced Analytics',
                'API Access',
                'Dedicated Account Manager',
            ],
        },
    ];

    const displayPlans = availablePlans.length > 0 ? availablePlans : mockPlans;

    return (
        <CustomerLayout title="Subscription" subtitle="Manage your plan and billing">
            {/* Current Plan Banner */}
            <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-xl p-6 mb-6 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <Crown className="w-6 h-6 mr-2" />
                            <span className="text-sm font-medium text-white/80">Current Plan</span>
                        </div>
                        <h2 className="text-2xl font-bold">
                            {currentPlan?.plan_name || 'Starter Plan'}
                        </h2>
                        <p className="text-white/80 mt-1">
                            {currentPlan?.expires_at
                                ? `Renews on ${format(new Date(currentPlan.expires_at), 'MMM dd, yyyy')}`
                                : 'Free forever'}
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm text-white/70">Days remaining</p>
                            <p className="text-2xl font-bold">{currentPlan?.days_remaining || '∞'}</p>
                        </div>
                        <Zap className="w-12 h-12 text-yellow-300" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('plans')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'plans'
                                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Star className="w-4 h-4 inline mr-2" />
                        Available Plans
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'history'
                                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50/50'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Clock className="w-4 h-4 inline mr-2" />
                        Payment History
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-lg ${plan.is_popular ? 'border-teal-500' : plan.is_current ? 'border-green-500' : 'border-gray-200'
                                }`}
                        >
                            {plan.is_popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                                    MOST POPULAR
                                </div>
                            )}
                            {plan.is_current && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                    CURRENT PLAN
                                </div>
                            )}

                            <div className="text-center mb-6 pt-2">
                                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                                    </span>
                                    {plan.price > 0 && (
                                        <span className="text-gray-500">/{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-700">
                                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => !plan.is_current && handleUpgrade(plan.id)}
                                disabled={plan.is_current}
                                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${plan.is_current
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : plan.is_popular
                                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                            >
                                {plan.is_current ? (
                                    <>
                                        <Shield className="w-4 h-4 mr-2" />
                                        Current Plan
                                    </>
                                ) : (
                                    <>
                                        Upgrade Now
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment History */}
            {activeTab === 'history' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        </div>
                    ) : paymentHistory.length === 0 ? (
                        <div className="p-12 text-center">
                            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No payment history</h3>
                            <p className="text-gray-500 mt-1">Your payment history will appear here</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Invoice
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paymentHistory.map((payment, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {payment.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{payment.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${payment.status === 'success'
                                                            ? 'bg-green-100 text-green-800'
                                                            : payment.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-teal-600 hover:text-teal-800 transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </CustomerLayout>
    );
};

export default CustomerSubscription;
