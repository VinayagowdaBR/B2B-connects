import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Loader2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { customerSubscriptionApi } from '@/api/endpoints/customer/subscription';

const DemoPaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const txn = searchParams.get('txn');
    const amount = searchParams.get('amount');
    const plan = searchParams.get('plan');

    // Use ref to track if payment has been processed (synchronous update)
    const processedRef = useRef(false);

    useEffect(() => {
        // Prevent double processing
        if (processedRef.current || !txn) return;

        // Mark as processed immediately
        processedRef.current = true;

        const processPayment = async () => {
            try {
                // Simulate payment processing delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Call backend to confirm the demo payment
                await customerSubscriptionApi.confirmDemoPayment(txn, plan, amount);

                setIsProcessing(false);
                setIsSuccess(true);
                toast.success('Demo payment recorded successfully!');

                // Redirect to subscription page after 3 seconds
                setTimeout(() => {
                    navigate('/customer/subscription');
                }, 3000);
            } catch (err) {
                console.error('Payment confirmation error:', err);
                setIsProcessing(false);
                setError(err.response?.data?.detail || 'Failed to record payment');
                toast.error('Payment confirmation failed');
            }
        };

        if (txn && plan && amount) {
            processPayment();
        }
    }, [txn, plan, amount, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                {isProcessing ? (
                    <>
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
                        <p className="text-gray-500 mb-4">Please wait while we process your demo payment...</p>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Amount: <span className="font-bold text-gray-900">₹{amount}</span></p>
                            <p className="text-xs text-gray-400 mt-1">Transaction ID: {txn}</p>
                        </div>
                    </>
                ) : isSuccess ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-4">Your subscription has been upgraded successfully.</p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-600">Amount Paid: <span className="font-bold">₹{amount}</span></p>
                            <p className="text-xs text-green-500 mt-1">Transaction ID: {txn}</p>
                        </div>
                        <p className="text-sm text-gray-400">Redirecting to subscription page...</p>
                    </>
                ) : error ? (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/customer/subscription')}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                            Go Back to Subscription
                        </button>
                    </>
                ) : null}

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-400">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span>Demo Mode - Payment recorded for testing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoPaymentPage;
