import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Loader2, CheckCircle2, XCircle, UserPlus } from 'lucide-react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '', bgColor: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        const levels = [
            { strength: 1, label: 'Weak', color: 'text-red-400', bgColor: 'bg-red-500' },
            { strength: 2, label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500' },
            { strength: 3, label: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-500' },
            { strength: 4, label: 'Strong', color: 'text-green-400', bgColor: 'bg-green-500' },
        ];

        return levels[strength - 1] || { strength: 0, label: '', color: '', bgColor: '' };
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordStrength.strength < 2) {
            setError('Please choose a stronger password');
            return;
        }

        setIsLoading(true);

        try {
            const user = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Role-based navigation
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-auth relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="orb orb-1 top-[-10%] right-[-5%]"></div>
                <div className="orb orb-2 bottom-[-15%] left-[-10%]"></div>
                <div className="orb orb-3 top-[50%] left-[5%]"></div>
                <div className="absolute top-[10%] left-[50%] w-72 h-72 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-[20%] right-[15%] w-56 h-56 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 rounded-full blur-2xl animate-float-reverse"></div>
            </div>

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Register Card */}
            <div className="relative w-full max-w-md animate-slide-up">
                <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 animate-spin-slow opacity-75 blur-sm"></div>
                            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <UserPlus className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                        <p className="text-white/60 text-sm sm:text-base">Join us today and get started</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl animate-fade-in backdrop-blur-sm">
                            <p className="text-white text-sm text-center font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                            <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-premium w-full h-14 pl-12 pr-4 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.15s' }}>
                            <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-premium w-full h-14 pl-12 pr-4 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                            <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-premium w-full h-14 pl-12 pr-12 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-3 animate-fade-in">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-white/60">Password strength:</span>
                                        <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 rounded-full transition-all duration-500 ${level <= passwordStrength.strength
                                                        ? passwordStrength.bgColor
                                                        : 'bg-white/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.25s' }}>
                            <label className="block text-white/80 text-sm font-medium mb-2 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-premium w-full h-14 pl-12 pr-12 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {formData.confirmPassword && (
                                <div className="mt-2 flex items-center animate-fade-in">
                                    {passwordsMatch ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                                            <span className="text-xs text-green-400 font-medium">Passwords match</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 text-red-400 mr-2" />
                                            <span className="text-xs text-red-400 font-medium">Passwords don't match</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-white-glow w-full h-14 rounded-xl bg-white text-indigo-600 font-semibold text-lg shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <p className="text-white/60 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-white font-semibold hover:text-violet-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
