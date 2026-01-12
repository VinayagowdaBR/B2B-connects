import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, Loader2, Sparkles } from 'lucide-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(username, password);

      // Role-based navigation
      if (user.is_superuser) {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Check for 403 specifically
      if (err.response?.status === 403 && err.response?.data?.detail?.includes('approval')) {
        setError('Your account is pending approval. Please wait for administrator verification.');
      } else {
        setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-auth relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 top-[-10%] left-[-5%]"></div>
        <div className="orb orb-2 bottom-[-15%] right-[-10%]"></div>
        <div className="orb orb-3 top-[40%] right-[10%]"></div>
        <div className="absolute top-[20%] left-[60%] w-64 h-64 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-[30%] left-[10%] w-48 h-48 bg-gradient-to-r from-violet-500/25 to-fuchsia-500/25 rounded-full blur-2xl animate-float-reverse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-slide-up">
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 animate-spin-slow opacity-75 blur-sm"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-white/60 text-sm sm:text-base">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm animate-fade-in">
              <p className="text-sm text-white font-medium text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                Email or Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@example.com or 9876543210"
                  required
                  className="input-premium w-full h-14 pl-12 pr-4 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-white/80 mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-white/40 group-focus-within:text-white/70 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input-premium w-full h-14 pl-12 pr-12 rounded-xl text-white placeholder-white/40 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all ${rememberMe
                    ? 'bg-violet-500 border-violet-500'
                    : 'border-white/30 group-hover:border-white/50'
                    }`}>
                    {rememberMe && (
                      <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-sm text-white/70 group-hover:text-white/90 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-white/70 hover:text-white transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-white-glow w-full h-14 rounded-xl bg-white text-indigo-600 font-semibold text-lg shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-white/60">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-white font-semibold hover:text-violet-300 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-white/40 text-sm mt-6 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          Protected by advanced encryption
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
