import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/layout/AdminSidebar';
import BlogPostEditModal from '@/components/admin/BlogPostEditModal';
import { adminBlogPostsApi } from '@/api/endpoints/adminBlogPosts';
import {
  FileText,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  Filter,
  Star,
  Calendar,
  User,
  Tag,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

const CompanyBlogPostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPublished, setFilterPublished] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTenant, setFilterTenant] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await adminBlogPostsApi.getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await adminBlogPostsApi.updateBlogPost(selectedPost.id, data);
      toast.success('Blog post updated successfully!');
      fetchPosts();
      setIsModalOpen(false);
      setSelectedPost(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update blog post');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await adminBlogPostsApi.deleteBlogPost(id);
      toast.success('Blog post deleted successfully!');
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete blog post');
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPublished =
      filterPublished === 'all' ||
      (filterPublished === 'published' && post.is_published) ||
      (filterPublished === 'draft' && !post.is_published);

    const matchesFeatured =
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && post.is_featured) ||
      (filterFeatured === 'regular' && !post.is_featured);

    const matchesCategory = !filterCategory || post.category === filterCategory;
    const matchesTenant = !filterTenant || post.tenant_id?.toString().includes(filterTenant);

    return matchesSearch && matchesPublished && matchesFeatured && matchesCategory && matchesTenant;
  });

  // Get unique values
  const uniqueTenants = [...new Set(posts.map((p) => p.tenant_id))].sort((a, b) => a - b);
  const uniqueCategories = [...new Set(posts.map((p) => p.category).filter(Boolean))];

  // Stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.is_published).length;
  const featuredPosts = posts.filter((p) => p.is_featured).length;
  const draftPosts = posts.filter((p) => !p.is_published).length;
  const uniqueCompanies = uniqueTenants.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-sm text-gray-500">Manage all customers' blog content</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'table'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalPosts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{publishedPosts}</p>
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
                  <p className="text-3xl font-bold text-amber-600 mt-2">{featuredPosts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{draftPosts}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{uniqueCompanies}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
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
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Posts</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>

              <select
                value={filterFeatured}
                onChange={(e) => setFilterFeatured(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Posts</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

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

              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                {filteredPosts.length} of {totalPosts} posts
              </div>
            </div>
          </div>

          {/* Content Views */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No blog posts found</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
                    >
                      {/* Featured Image */}
                      <div className="relative aspect-video bg-gradient-to-br from-indigo-100 to-purple-100">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-16 h-16 text-indigo-300" />
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-medium">
                            #{post.tenant_id}
                          </span>
                          {post.is_featured && (
                            <span className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-medium flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${post.is_published
                                ? 'bg-green-500 text-white'
                                : 'bg-orange-500 text-white'
                              }`}
                          >
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="p-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Post Info */}
                      <div className="p-5">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.category && (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {post.category}
                            </span>
                          )}
                          {post.reading_time && (
                            <span className="inline-flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.reading_time}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {post.title || 'Untitled Post'}
                        </h3>

                        {post.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                        )}

                        {/* Author & Date */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="w-3 h-3 mr-1" />
                            {post.author || 'Anonymous'}
                          </div>
                          {post.published_date && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {format(new Date(post.published_date), 'MMM dd, yyyy')}
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {(() => {
                          const tagsArray = Array.isArray(post.tags)
                            ? post.tags
                            : typeof post.tags === 'string'
                              ? post.tags.split(',').map(t => t.trim()).filter(Boolean)
                              : [];

                          if (tagsArray.length === 0) return null;

                          return (
                            <div className="flex flex-wrap gap-1 pt-3 border-t border-gray-100 mt-3">
                              {tagsArray.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {tagsArray.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                  +{tagsArray.length - 3}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table View - will add in final summary */}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      <BlogPostEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={handleUpdate}
        blogPost={selectedPost}
      />
    </div>
  );
};

export default CompanyBlogPostsManagement;
