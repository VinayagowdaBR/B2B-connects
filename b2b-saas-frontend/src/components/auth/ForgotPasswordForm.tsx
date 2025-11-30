import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await authApi.forgotPassword(email);
            setMessage('Password reset link has been sent to your email address.');
            setIsSuccess(true);
            setEmail('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md animate-slide-up">
            <div className="glass rounded-2xl shadow-2xl p-8 backdrop-blur-xl bg-white/10 border border-white/20">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 mb-4">
                        {isSuccess ? (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        ) : (
                            <Mail className="w-8 h-8 text-white" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isSuccess ? 'Check Your Email' : 'Forgot Password?'}
                    </h2>
                    <p className="text-white/70">
                        {isSuccess
                            ? 'We\'ve sent you a password reset link'
                            : 'Enter your email to receive a reset link'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg animate-fade-in">
                        <p className="text-red-100 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {message && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg animate-fade-in">
                        <p className="text-green-100 text-sm text-center">{message}</p>
                    </div>
                )}

                {!isSuccess ? (
                    <>
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-white/50" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-white/80 text-sm">
                            If an account exists with this email, you will receive a password reset link shortly.
                        </p>
                        <button
                            onClick={() => {
                                setIsSuccess(false);
                                setMessage('');
                            }}
                            className="text-primary-300 hover:text-primary-200 text-sm font-medium transition-colors"
                        >
                            Send another link
                        </button>
                    </div>
                )}

                {/* Back to Login Link */}
                <div className="mt-6">
                    <Link
                        to="/login"
                        className="flex items-center justify-center text-white/70 hover:text-white text-sm transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
