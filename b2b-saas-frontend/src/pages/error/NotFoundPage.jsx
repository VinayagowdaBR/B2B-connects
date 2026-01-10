import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden relative selection:bg-indigo-500/30">
        {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full px-6 text-center">
        {/* Glitch Effect Text */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2 relative"
        >
          404
        </motion.h1>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Look like you're lost in space
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="group px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <Link
            to="/"
            className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>
      </div>

      {/* Decorative footer text */}
      <div className="absolute bottom-8 text-gray-600 text-sm">
        Error Code: 404_PAGE_NOT_FOUND
      </div>
    </div>
  );
};

export default NotFoundPage;
