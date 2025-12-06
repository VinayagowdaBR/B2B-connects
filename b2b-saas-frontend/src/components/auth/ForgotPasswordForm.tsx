import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/endpoints/auth';
import { Mail, ArrowLeft, Loader2, CheckCircle2, KeyRound } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-auth relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="orb orb-1 top-[-5%] left-[10%]"></div>
                <div className="orb orb-2 bottom-[-10%] right-[-5%]"></div>
                <div className="orb orb-3 top-[60%] right-[20%]"></div>
                <div className="absolute top-[30%] right-[40%] w-64 h-64 bg-gradient-to-r from-violet-500/25 to-indigo-500/25 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute bottom-[40%] left-[20%] w-48 h-48 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-float"></div>
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Forgot Password Card */}
            <div className="relative w-full max-w-md animate-slide-up">
                <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${isSuccess
                                    ? 'from-green-500 via-emerald-500 to-teal-500'
                                    : 'from-violet-500 via-purple-500 to-indigo-500'
                                } animate-spin-slow opacity-75 blur-sm`}></div>
                            <div className={`relative w-full h-full rounded-full ${isSuccess
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                } flex items-center justify-center shadow-lg transition-colors duration-500`}>
                                {isSuccess ? (
                                    <CheckCircle2 className="w-10 h-10 text-white" />
                                ) : (
                                    <KeyRound className="w-10 h-10 text-white" />
                                )}
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                            {isSuccess ? 'Check Your Email' : 'Forgot Password?'}
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base">
                            {isSuccess
                                ? "We've sent you a password reset link"
                                : 'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl animate-fade-in backdrop-blur-sm">
                            <p className="text-white text-sm text-center font-medium">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl animate-fade-in backdrop-blur-sm">
                            <p className="text-white text-sm text-center font-medium">{message}</p>
                        </div>
                    )}

                    {!isSuccess ? (
                        <>
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                                    <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-premium w-full h-14 pl-12 pr-4 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-white-glow w-full h-14 rounded-xl bg-white text-indigo-600 font-semibold text-lg shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
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
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-4 animate-fade-in">
                            <p className="text-white/70 text-sm">
                                If an account exists with this email, you will receive a password reset link shortly.
                            </p>
                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    setMessage('');
                                }}
                                className="text-violet-300 hover:text-violet-200 text-sm font-semibold transition-colors inline-flex items-center gap-1"
                            >
                                <Mail className="w-4 h-4" />
                                Send another link
                            </button>
                        </div>
                    )}

                    {/* Back to Login Link */}
                    <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Link
                            to="/login"
                            className="flex items-center justify-center text-white/60 hover:text-white text-sm transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
