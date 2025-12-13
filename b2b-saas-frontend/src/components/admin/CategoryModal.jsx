import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, onSubmit, category }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: 'bg-blue-500',
        image_url: '',
        display_order: 0,
        is_active: true,
    });
    const [isLoading, setIsLoading] = useState(false);

    const colorOptions = [
        'bg-blue-500',
        'bg-green-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-orange-500',
        'bg-teal-500',
        'bg-gray-600',
        'bg-amber-500',
        'bg-rose-500',
    ];

    const iconOptions = [
        'Building2',
        'Cpu',
        'Stethoscope',
        'Wheat',
        'Shirt',
        'Package',
        'Factory',
        'Truck',
        'Wrench',
        'FlaskConical',
        'Utensils',
        'Gem',
        'ShoppingCart',
        'Car',
        'Home',
        'Laptop',
        'Smartphone',
        'Camera',
    ];

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                description: category.description || '',
                icon: category.icon || '',
                color: category.color || 'bg-blue-500',
                image_url: category.image_url || '',
                display_order: category.display_order || 0,
                is_active: category.is_active !== undefined ? category.is_active : true,
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '',
                color: 'bg-blue-500',
                image_url: '',
                display_order: 0,
                is_active: true,
            });
        }
    }, [category, isOpen]);

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[&]/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            // Error handled by parent
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle bg-white shadow-xl rounded-2xl transform transition-all">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                        {category ? 'Edit Category' : 'Add New Category'}
                    </h3>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Electronics & Electrical"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Slug *
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                                placeholder="electronics-electrical"
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Brief description of this category"
                            />
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon (Lucide Icon Name)
                            </label>
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="">Select an icon...</option>
                                {iconOptions.map((icon) => (
                                    <option key={icon} value={icon}>
                                        {icon}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Theme
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color })}
                                        className={`w-8 h-8 rounded-lg ${color} ${formData.color === color
                                                ? 'ring-2 ring-offset-2 ring-indigo-500'
                                                : ''
                                            } transition-all`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Display Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Active (visible on landing page)
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : category ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
