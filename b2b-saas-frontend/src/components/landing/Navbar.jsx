import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, User, Building2 } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const categories = [
        'Building & Construction',
        'Electronics & Electrical',
        'Industrial Machinery',
        'Food & Agriculture',
        'Apparel & Garments',
        'Healthcare & Medical',
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">B2B<span className="text-blue-600">Connect</span></span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search products, services, businesses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </form>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                        >
                            Register Business
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Category Links - Desktop */}
                <div className="hidden md:flex items-center space-x-6 py-2 border-t border-gray-100">
                    {categories.map((category) => (
                        <Link
                            key={category}
                            to={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
                        >
                            {category}
                        </Link>
                    ))}
                    <button className="text-sm text-blue-600 font-medium flex items-center">
                        More <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
                    <div className="px-4 py-3">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-lg"
                                >
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="px-4 py-2 space-y-1">
                        {categories.map((category) => (
                            <Link
                                key={category}
                                to={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                                className="block py-2 text-gray-600 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-100 space-y-2">
                        <Link
                            to="/login"
                            className="block w-full py-2.5 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="block w-full py-2.5 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Register Business
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
