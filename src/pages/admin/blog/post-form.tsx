import { useState } from 'react';
import { createPost, updatePost } from '@/lib/blog/admin';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { NotificationStatus } from '@/components/admin/blog/notification-status';
import { formatImageUrl } from '@/lib/blog';
import type { BlogFormData, BlogPost, BlogCategory } from '@/lib/blog/types';
import { useAuth } from '@/contexts/auth-context';

interface PostFormProps {
  initialData?: BlogPost;
  categories: BlogCategory[];
  onSuccess: () => void;
}

export function PostForm({ initialData, categories, onSuccess }: PostFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    thumbnail_url: initialData?.thumbnail_url ? formatImageUrl(initialData.thumbnail_url) : '',
    published: initialData?.published || false,
    category_ids: initialData?.categories?.map(c => c.category.id) || []
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user?.id) throw new Error('User not authenticated');

      const postData = {
        ...formData,
        author_id: user.id
      };

      if (initialData) {
        await updatePost(initialData.id, postData);
      } else {
        await createPost(postData);
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 backdrop-blur-sm rounded-lg p-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <RichTextEditor
            content={formData.content}
            onChange={content => setFormData(prev => ({ ...prev, content }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea
            required
            rows={3}
            value={formData.excerpt}
            onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
          <ImageUpload
            value={formData.thumbnail_url}
            onChange={url => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          <select
            multiple
            value={formData.category_ids}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setFormData(prev => ({ ...prev, category_ids: selected }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={e => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Published
          </label>
        </div>
      </div>

      {/* Notification Status */}
      {initialData?.id && (
        <div className="border-t pt-6">
          <NotificationStatus 
            postId={initialData.id} 
            published={formData.published} 
          />
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}