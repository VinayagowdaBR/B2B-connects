import { useState, useEffect } from 'react';
import { X, Newspaper, Save, Image as ImageIcon } from 'lucide-react';

const BlogPostModal = ({ isOpen, onClose, onSubmit, post }) => {
    const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', category: '', featured_image_url: '', tags: '', slug: '', meta_description: '', is_published: false });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (post) setFormData({ title: post.title || '', content: post.content || '', excerpt: post.excerpt || '', category: post.category || '', featured_image_url: post.featured_image_url || '', tags: post.tags || '', slug: post.slug || '', meta_description: post.meta_description || '', is_published: post.is_published ?? false });
        else setFormData({ title: '', content: '', excerpt: '', category: '', featured_image_url: '', tags: '', slug: '', meta_description: '', is_published: false });
    }, [post, isOpen]);

    const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = async (e) => { e.preventDefault(); try { setIsSubmitting(true); await onSubmit(formData); } finally { setIsSubmitting(false); } };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b z-10">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-3"><Newspaper className="w-5 h-5 text-white" /></div>
                            <h2 className="text-lg font-bold">{post ? 'Edit Post' : 'New Blog Post'}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 border rounded-lg" placeholder="Enter post title" /></div>
                        <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Brief summary..." /></div>
                        <div><label className="block text-sm font-medium mb-1">Content *</label><textarea name="content" value={formData.content} onChange={handleChange} required rows={8} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="Write your blog post content..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-medium mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg"><option value="">Select</option><option value="Technology">Technology</option><option value="Business">Business</option><option value="Marketing">Marketing</option><option value="Updates">Updates</option><option value="Other">Other</option></select></div>
                            <div><label className="block text-sm font-medium mb-1">Tags</label><input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="tag1, tag2, tag3" /></div>
                        </div>
                        <div><label className="block text-sm font-medium mb-1"><ImageIcon className="w-4 h-4 inline mr-1" />Featured Image URL</label><input type="url" name="featured_image_url" value={formData.featured_image_url} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="https://..." /></div>
                        <div><label className="block text-sm font-medium mb-1">URL Slug</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-lg" placeholder="my-blog-post-url" /></div>
                        <div><label className="block text-sm font-medium mb-1">Meta Description (SEO)</label><textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border rounded-lg resize-none" placeholder="SEO meta description..." /></div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <label className="flex items-center cursor-pointer"><input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="mr-2 w-4 h-4 text-teal-600 rounded" />Publish immediately</label>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg disabled:opacity-50"><Save className="w-4 h-4 mr-2" />{isSubmitting ? 'Saving...' : formData.is_published ? 'Publish' : 'Save Draft'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogPostModal;
