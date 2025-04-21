import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatImageUrl } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      className="overflow-hidden rounded-lg bg-white/50 shadow-md backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/vidhya/${post.slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={formatImageUrl(post.thumbnail_url)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              // Fallback to default image on error
              (e.target as HTMLImageElement).src = '/default.png';
            }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
          <div className="mt-4 flex gap-2">
            {post.categories?.map(({ category }) => (
              <span
                key={category.id}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}