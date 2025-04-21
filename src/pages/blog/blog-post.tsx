import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogPost, formatImageUrl } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        if (!slug) return;
        const data = await getBlogPost(slug);
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/vidhya');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return <div className="min-h-screen flow-bg pt-24 px-4">Loading...</div>;
  }

  if (!post) {
    return null;
  }

  // Process content to preserve line breaks and format properly
  const processedContent = post.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('</p><p>');

  return (
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-video overflow-hidden rounded-xl">
            <img
              src={formatImageUrl(post.thumbnail_url)}
              alt={post.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback to default image on error
                (e.target as HTMLImageElement).src = '/default.png';
              }}
            />
          </div>

          <div className="mt-8">
            <div className="flex gap-2 mb-4">
              {post.categories?.map(({ category }) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-foreground">{post.title}</h1>
            
            <div className="mt-4 text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            <div 
              className="mt-8 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: `<p>${processedContent}</p>` 
              }}
            />
          </div>
        </motion.div>
      </article>
    </div>
  );
}