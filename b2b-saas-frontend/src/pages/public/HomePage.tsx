import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-6">Welcome to B2B SaaS Platform</h1>
                    <p className="text-xl mb-8">
                        The ultimate solution for your business needs
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/login"
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
