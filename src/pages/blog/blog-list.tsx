import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { BlogCard } from '@/components/blog/blog-card';
import { SearchBar } from '@/components/blog/search-bar';
import { getBlogPosts } from '@/lib/blog';
import { usePageLoading } from '@/hooks/use-page-loading';
import type { BlogPost } from '@/lib/blog';

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  usePageLoading(loading);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const data = await getBlogPosts();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const searchTerm = query.toLowerCase();
    const results = posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) || 
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.categories?.some(c => c.category.name.toLowerCase().includes(searchTerm))
    );
    
    setFilteredPosts(results);
  };
  return (
    <div className="min-h-screen flow-bg pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BookOpen className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground">
            Vidhya
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore ancient wisdom and modern science through our collection of articles on breathing techniques and wellness.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>

        {filteredPosts.length === 0 && !loading ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg text-muted-foreground">No articles found matching your search.</p>
            <button 
              onClick={() => handleSearch('')}
              className="mt-4 text-primary hover:underline"
            >
              View all articles
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}