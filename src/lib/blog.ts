import { supabase } from './supabase';

// Helper function to ensure correct image URL format
export function formatImageUrl(url: string): string {
  if (!url) return '';
  
  // If URL is already using the correct domain, return it as is
  if (url.includes('breathe.vayu-prana.com')) {
    return url;
  }
  
  // If URL is using the Supabase storage URL, replace it with the correct domain
  if (url.includes('yakibuftxtsvqnwnermi.supabase.co')) {
    return url.replace(
      'https://yakibuftxtsvqnwnermi.supabase.co',
      'https://breathe.vayu-prana.com'
    );
  }
  
  // If it's a relative URL, make it absolute
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail_url: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  categories?: BlogCategory[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categories:blog_post_categories(
        category:blog_categories(*)
      )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categories:blog_post_categories(
        category:blog_categories(*)
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as BlogPost;
}