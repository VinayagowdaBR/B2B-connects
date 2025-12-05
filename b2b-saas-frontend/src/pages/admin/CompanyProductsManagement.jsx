import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import ProductEditModal from '@/components/admin/ProductEditModal';
import { adminProductsApi } from '@/api/endpoints/adminProducts';
import {
  Package,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Tag,
  Star,
  DollarSign,
  Image as ImageIcon,
  TrendingUp,
  ShoppingCart,
  ExternalLink,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [filterFeatured, setFilterFeatured] = useState('all'); // 'all', 'featured', 'regular'
  const [filterStock, setFilterStock] = useState('all'); // 'all', 'in_stock', 'out_of_stock'
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await adminProductsApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminProductsApi.updateProduct(selectedProduct.id, data);
      toast.success('Product updated successfully!');
      fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update product');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminProductsApi.deleteProduct(id);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.is_active) ||
      (filterStatus === 'inactive' && !product.is_active);

    const matchesFeatured =
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && product.is_featured) ||
      (filterFeatured === 'regular' && !product.is_featured);

    const matchesStock =
      filterStock === 'all' || product.stock_status === filterStock;

    const matchesTenant = !filterTenant || product.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesStatus && matchesFeatured && matchesStock && matchesTenant;
  });

  // Get unique values for filters
  const uniqueTenants = [...new Set(products.map((p) => p.tenant_id))].sort((a, b) => a - b);
  const uniqueCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const featuredProducts = products.filter((p) => p.is_featured).length;
  const inStockProducts = products.filter((p) => p.stock_status === 'in_stock').length;
  const uniqueCompanies = uniqueTenants.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between pl-12 lg:pl-0">
            <div className="flex-1 min-w-0 mr-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Company Products</h1>
              <p className="text-xs sm:text-sm text-gray-500">Manage all customers' product catalog</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'table'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{activeProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">{featuredProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Stock</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{inStockProducts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{uniqueCompanies}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              {/* Featured Filter */}
              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Products</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>

              {/* Stock Filter */}
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="on_backorder">On Backorder</option>
                <option value="discontinued">Discontinued</option>
              </select>

              {/* Tenant Filter */}
              <select
                value={filterTenant}
                onChange={(e) => setFilterTenant(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Companies</option>
                {uniqueTenants.map((tenantId) => (
                  <option key={tenantId} value={tenantId}>
                    Tenant #{tenantId}
                  </option>
                ))}
              </select>

              {/* Results Count */}
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                {filteredProducts.length} of {totalProducts} products
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === 'table' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto -mx-px">
                    <table className="w-full min-w-[900px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Updated
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-start space-x-3">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Package className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                      {product.name || 'Untitled Product'}
                                    </div>
                                    {product.is_featured && (
                                      <Star className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />
                                    )}
                                    {product.external_url && (
                                      <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    )}
                                  </div>
                                  {product.sku && (
                                    <div className="text-xs text-gray-500 mt-1">SKU: {product.sku}</div>
                                  )}
                                  {product.short_description && (
                                    <div className="text-xs text-gray-600 line-clamp-1 mt-1">
                                      {product.short_description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                #{product.tenant_id}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.category ? (
                                <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {product.category}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">No category</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.price ? (
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                                  {product.price}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${product.stock_status === 'in_stock'
                                    ? 'bg-green-100 text-green-800'
                                    : product.stock_status === 'out_of_stock'
                                      ? 'bg-red-100 text-red-800'
                                      : product.stock_status === 'on_backorder'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                  }`}
                              >
                                {product.stock_status?.replace('_', ' ') || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${product.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {product.is_active ? (
                                  <>
                                    <Eye className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(product.updated_at), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-gray-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-2">
                          <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                            #{product.tenant_id}
                          </span>
                          {product.is_featured && (
                            <span className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Stock Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${product.stock_status === 'in_stock'
                                ? 'bg-green-500 text-white'
                                : product.stock_status === 'out_of_stock'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-yellow-500 text-white'
                              }`}
                          >
                            {product.stock_status?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">
                            {product.name || 'Untitled Product'}
                          </h3>
                          {product.external_url && (
                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        {product.category && (
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              {product.category}
                            </span>
                          </div>
                        )}

                        {product.short_description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                            {product.short_description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {product.price ? (
                            <div className="text-lg font-bold text-indigo-600">{product.price}</div>
                          ) : (
                            <div className="text-sm text-gray-400">No price</div>
                          )}

                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {product.sku && (
                          <div className="text-xs text-gray-500 mt-2">SKU: {product.sku}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      <ProductEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleUpdate}
        product={selectedProduct}
      />
    </div>
  );
};

export default CompanyProductsManagement;
