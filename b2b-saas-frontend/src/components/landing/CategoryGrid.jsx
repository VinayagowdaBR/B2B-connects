import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2,
    Cpu,
    Stethoscope,
    Wheat,
    Shirt,
    Package,
    Truck,
    Factory,
    Wrench,
    FlaskConical,
    Utensils,
    Gem,
    ShoppingCart,
    Car,
    Home,
    Laptop,
    Smartphone,
    Camera,
    Loader2,
    Grid3X3,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { publicApi } from '@/api/endpoints/publicApi';

// Icon mapping for dynamic icons
const iconMap = {
    Building2,
    Cpu,
    Stethoscope,
    Wheat,
    Shirt,
    Package,
    Truck,
    Factory,
    Wrench,
    FlaskConical,
    Utensils,
    Gem,
    ShoppingCart,
    Car,
    Home,
    Laptop,
    Smartphone,
    Camera,
    Grid3X3,
};

// Color classes mapping
const colorVariants = {
    'bg-orange-500': 'from-orange-500 to-orange-600',
    'bg-blue-500': 'from-blue-500 to-blue-600',
    'bg-green-500': 'from-green-500 to-emerald-600',
    'bg-yellow-500': 'from-yellow-500 to-amber-600',
    'bg-pink-500': 'from-pink-500 to-rose-600',
    'bg-purple-500': 'from-purple-500 to-violet-600',
    'bg-gray-600': 'from-gray-600 to-gray-700',
    'bg-indigo-500': 'from-indigo-500 to-indigo-600',
    'bg-red-500': 'from-red-500 to-red-600',
    'bg-teal-500': 'from-teal-500 to-teal-600',
    'bg-amber-500': 'from-amber-500 to-amber-600',
    'bg-rose-500': 'from-rose-500 to-rose-600',
    'bg-cyan-500': 'from-cyan-500 to-cyan-600',
};

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Default categories as fallback when database is empty
    const defaultCategories = [
        { name: 'Building & Construction', slug: 'building-construction', icon: 'Building2', color: 'bg-orange-500', count: 0 },
        { name: 'Electronics & Electrical', slug: 'electronics-electrical', icon: 'Cpu', color: 'bg-blue-500', count: 0 },
        { name: 'Healthcare & Medical', slug: 'healthcare-medical', icon: 'Stethoscope', color: 'bg-green-500', count: 0 },
        { name: 'Food & Agriculture', slug: 'food-agriculture', icon: 'Wheat', color: 'bg-yellow-500', count: 0 },
        { name: 'Apparel & Garments', slug: 'apparel-garments', icon: 'Shirt', color: 'bg-pink-500', count: 0 },
        { name: 'Packaging & Supplies', slug: 'packaging-supplies', icon: 'Package', color: 'bg-purple-500', count: 0 },
        { name: 'Industrial Machinery', slug: 'industrial-machinery', icon: 'Factory', color: 'bg-gray-600', count: 0 },
        { name: 'Transportation & Logistics', slug: 'transportation-logistics', icon: 'Truck', color: 'bg-indigo-500', count: 0 },
        { name: 'Tools & Equipment', slug: 'tools-equipment', icon: 'Wrench', color: 'bg-red-500', count: 0 },
        { name: 'Chemicals & Dyes', slug: 'chemicals-dyes', icon: 'FlaskConical', color: 'bg-teal-500', count: 0 },
        { name: 'Food Services', slug: 'food-services', icon: 'Utensils', color: 'bg-amber-500', count: 0 },
        { name: 'Jewellery & Accessories', slug: 'jewellery-accessories', icon: 'Gem', color: 'bg-rose-500', count: 0 },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await publicApi.getCategories();
                // Use API data if available, otherwise use defaults
                if (data && data.length > 0) {
                    setCategories(data);
                } else {
                    setCategories(defaultCategories);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                // Fallback to default categories on error
                setCategories(defaultCategories);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Format count display
    const formatCount = (count) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K+`;
        }
        return `${count}`;
    };

    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading categories...</span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        Explore Industries
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore thousands of products and services across various industries
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
                    {categories.slice(0, 12).map((category, index) => {
                        // Get icon component from map, fallback to Grid3X3
                        const IconComponent = iconMap[category.icon] || Grid3X3;
                        const gradientClass = colorVariants[category.color] || 'from-blue-500 to-blue-600';

                        return (
                            <Link
                                key={category.slug || category.id}
                                to={`/search?category=${category.slug || category.name}`}
                                className="group relative bg-white rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent overflow-hidden"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Hover gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-lg`}>
                                        <IconComponent className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-xs font-medium text-gray-500 group-hover:text-white/80 transition-colors">
                                            {formatCount(category.count || 0)} items
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow on hover */}
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowRight className="h-4 w-4 text-white" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Link */}
                <div className="text-center mt-10">
                    <Link
                        to="/search"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                    >
                        View All Categories
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
