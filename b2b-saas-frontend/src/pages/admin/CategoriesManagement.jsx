import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CategoryModal from '@/components/admin/CategoryModal';
import { categoriesApi } from '@/api/endpoints/categories';
import {
    FolderTree,
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    Wrench,
    CheckCircle,
    AlertCircle,
    Grid3X3,
} from 'lucide-react';

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoriesApi.getAll(0, 100, true);
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data) => {
        try {
            await categoriesApi.create(data);
            toast.success('Category created successfully!');
            fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to create category');
            throw error;
        }
    };

    const handleUpdate = async (data) => {
        try {
            await categoriesApi.update(selectedCategory.id, data);
            toast.success('Category updated successfully!');
            fetchCategories();
            setIsModalOpen(false);
            setSelectedCategory(null);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to update category');
            throw error;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesApi.delete(id);
            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to delete category');
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = categories.filter((cat) => cat.is_active).length;
    const totalProducts = categories.reduce((acc, cat) => acc + (cat.product_count || 0), 0);
    const totalServices = categories.reduce((acc, cat) => acc + (cat.service_count || 0), 0);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between pl-12 lg:pl-0">
                        <div className="flex-1 min-w-0 mr-4">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h1>
                            <p className="text-xs sm:text-sm text-gray-500">Manage product and service categories</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setIsModalOpen(true);
                            }}
                            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center space-x-1 sm:space-x-2 font-medium shadow-lg text-sm sm:text-base whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Add Category</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Categories</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <FolderTree className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Categories</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{totalProducts}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Services</p>
                                    <p className="text-3xl font-bold text-orange-600 mt-2">{totalServices}</p>
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                    <Wrench className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Categories Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No categories found</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setIsModalOpen(true);
                                }}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Add Your First Category
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                                >
                                    {/* Card Header with Color */}
                                    <div className={`h-3 ${category.color || 'bg-blue-500'}`}></div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-1">
                                                    Slug: <code className="bg-gray-100 px-1 rounded">{category.slug}</code>
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-2">
                                                    {category.description || 'No description provided'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Icon & Color Info */}
                                        <div className="flex items-center space-x-4 mb-3">
                                            {category.icon && (
                                                <span className="text-xs text-gray-500">
                                                    Icon: <code className="bg-gray-100 px-1 rounded">{category.icon}</code>
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">
                                                Color: <span className={`inline-block w-3 h-3 rounded ${category.color || 'bg-blue-500'}`}></span>
                                            </span>
                                        </div>

                                        {/* Counts */}
                                        <div className="flex items-center space-x-4 mb-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                                                <Package className="w-3 h-3 mr-1" />
                                                {category.product_count || 0} Products
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-medium">
                                                <Wrench className="w-3 h-3 mr-1" />
                                                {category.service_count || 0} Services
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${category.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {category.is_active ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                        Inactive
                                                    </>
                                                )}
                                            </span>
                                            <span className="text-xs text-gray-500">ID: {category.id}</span>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="p-4 bg-gray-50 flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                onSubmit={selectedCategory ? handleUpdate : handleCreate}
                category={selectedCategory}
            />
        </div>
    );
};

export default CategoriesManagement;
