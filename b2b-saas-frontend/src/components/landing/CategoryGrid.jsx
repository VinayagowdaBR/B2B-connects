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
    Gem
} from 'lucide-react';

const CategoryGrid = () => {
    const categories = [
        {
            name: 'Building & Construction',
            slug: 'building-construction',
            icon: Building2,
            color: 'bg-orange-500',
            count: '12K+ Products'
        },
        {
            name: 'Electronics & Electrical',
            slug: 'electronics-electrical',
            icon: Cpu,
            color: 'bg-blue-500',
            count: '8K+ Products'
        },
        {
            name: 'Healthcare & Medical',
            slug: 'healthcare-medical',
            icon: Stethoscope,
            color: 'bg-green-500',
            count: '5K+ Products'
        },
        {
            name: 'Food & Agriculture',
            slug: 'food-agriculture',
            icon: Wheat,
            color: 'bg-yellow-500',
            count: '15K+ Products'
        },
        {
            name: 'Apparel & Garments',
            slug: 'apparel-garments',
            icon: Shirt,
            color: 'bg-pink-500',
            count: '10K+ Products'
        },
        {
            name: 'Packaging & Supplies',
            slug: 'packaging-supplies',
            icon: Package,
            color: 'bg-purple-500',
            count: '6K+ Products'
        },
        {
            name: 'Industrial Machinery',
            slug: 'industrial-machinery',
            icon: Factory,
            color: 'bg-gray-600',
            count: '7K+ Products'
        },
        {
            name: 'Transportation & Logistics',
            slug: 'transportation-logistics',
            icon: Truck,
            color: 'bg-indigo-500',
            count: '4K+ Services'
        },
        {
            name: 'Tools & Equipment',
            slug: 'tools-equipment',
            icon: Wrench,
            color: 'bg-red-500',
            count: '9K+ Products'
        },
        {
            name: 'Chemicals & Dyes',
            slug: 'chemicals-dyes',
            icon: FlaskConical,
            color: 'bg-teal-500',
            count: '3K+ Products'
        },
        {
            name: 'Food Services',
            slug: 'food-services',
            icon: Utensils,
            color: 'bg-amber-500',
            count: '2K+ Services'
        },
        {
            name: 'Jewellery & Accessories',
            slug: 'jewellery-accessories',
            icon: Gem,
            color: 'bg-rose-500',
            count: '5K+ Products'
        },
    ];

    return (
        <section className="py-12 md:py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Browse by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore thousands of products and services across various industries
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <Link
                                key={category.slug}
                                to={`/category/${category.slug}`}
                                className="group bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                    <IconComponent className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-xs text-gray-500">{category.count}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
