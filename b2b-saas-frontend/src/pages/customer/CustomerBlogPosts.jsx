import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import BlogPostModal from '@/components/customer/modals/BlogPostModal';
import { customerBlogPostsApi } from '@/api/endpoints/customer/blogPosts';
import { Newspaper, Plus, Search, Edit, Trash2, Eye, EyeOff, Clock, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerBlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => { fetchPosts(); }, []);

    const fetchPosts = async () => {
        try { setIsLoading(true); const data = await customerBlogPostsApi.getMyBlogPosts(); setPosts(data || []); } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedPost) { await customerBlogPostsApi.updateBlogPost(selectedPost.id, data); toast.success('Updated!'); }
            else { await customerBlogPostsApi.createBlogPost(data); toast.success('Published!'); }
            setIsModalOpen(false); fetchPosts();
        } catch (e) { toast.error('Failed'); throw e; }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try { await customerBlogPostsApi.deleteBlogPost(id); toast.success('Deleted!'); fetchPosts(); } catch (e) { toast.error('Failed'); }
    };

    const filtered = posts.filter((p) => {
        const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.content?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || (filterStatus === 'published' && p.is_published) || (filterStatus === 'draft' && !p.is_published);
        return matchesSearch && matchesStatus;
    });

    return (
        <CustomerLayout title="Blog Posts" subtitle="Create and manage your blog content">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-gray-500">Total Posts</p><p className="text-2xl font-bold text-gray-900">{posts.length}</p></div>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"><Newspaper className="w-5 h-5 text-white" /></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-gray-500">Published</p><p className="text-2xl font-bold text-green-600">{posts.filter((p) => p.is_published).length}</p></div>
                        <Eye className="w-10 h-10 p-2 rounded-lg bg-green-100 text-green-600" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm text-gray-500">Drafts</p><p className="text-2xl font-bold text-orange-600">{posts.filter((p) => !p.is_published).length}</p></div>
                        <EyeOff className="w-10 h-10 p-2 rounded-lg bg-orange-100 text-orange-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm" />
                        </div>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                            <option value="all">All</option>
                            <option value="published">Published</option>
                            <option value="draft">Drafts</option>
                        </select>
                    </div>
                    <button onClick={() => { setSelectedPost(null); setIsModalOpen(true); }} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg text-sm">
                        <Plus className="w-4 h-4 mr-2" />New Post
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No blog posts</h3>
                    <p className="text-gray-500 mt-1">Start writing your first post</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg"><Plus className="w-4 h-4 inline mr-2" />Create Post</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {post.featured_image_url && (
                                    <img src={post.featured_image_url} alt="" className="w-full sm:w-40 h-28 object-cover rounded-lg flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{post.title || 'Untitled'}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.excerpt || post.content?.substring(0, 150) || 'No content'}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{post.created_at ? format(new Date(post.created_at), 'MMM dd, yyyy') : 'Date'}</span>
                                        {post.category && <span className="flex items-center"><Tag className="w-4 h-4 mr-1" />{post.category}</span>}
                                    </div>
                                </div>
                                <div className="flex sm:flex-col gap-2 flex-shrink-0">
                                    <button onClick={() => { setSelectedPost(post); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"><Edit className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <BlogPostModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedPost(null); }} onSubmit={handleSubmit} post={selectedPost} />
        </CustomerLayout>
    );
};

export default CustomerBlogPosts;
