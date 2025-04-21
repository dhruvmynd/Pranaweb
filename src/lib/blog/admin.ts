import { supabase } from '../supabase';
import { sendBlogNotification } from './notifications';
import { formatImageUrl } from '../blog';
import type { BlogPost, BlogCategory, BlogFormData } from './types';

export async function getAdminPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categories:blog_post_categories(
        category:blog_categories(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categories:blog_post_categories(
        category:blog_categories(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Format thumbnail URL
  if (data && data.thumbnail_url) {
    data.thumbnail_url = formatImageUrl(data.thumbnail_url);
  }
  
  return data as BlogPost;
}

async function updatePostCategories(postId: string, categoryIds: string[]) {
  // First, delete existing categories for this post
  const { error: deleteError } = await supabase
    .from('blog_post_categories')
    .delete()
    .eq('post_id', postId);

  if (deleteError) throw deleteError;

  // Then, insert new categories if any are provided
  if (categoryIds.length > 0) {
    const { error: insertError } = await supabase
      .from('blog_post_categories')
      .insert(
        categoryIds.map(categoryId => ({
          post_id: postId,
          category_id: categoryId
        }))
      );

    if (insertError) throw insertError;
  }
}

export async function createPost(formData: BlogFormData & { author_id: string }) {
  const { category_ids, ...postData } = formData;
  
  // First create the post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select()
    .single();

  if (postError) throw postError;

  // Then update categories
  await updatePostCategories(post.id, category_ids);

  // If post is published, trigger notification
  if (post.published) {
    try {
      await sendBlogNotification(post.id);
    } catch (error) {
      console.error('Error sending blog notification:', error);
      // Don't throw - we don't want to fail post creation if notification fails
    }
  }

  return post;
}

export async function updatePost(id: string, formData: Partial<BlogFormData> & { author_id: string }) {
  const { category_ids, ...postData } = formData;

  // Get current post state
  const { data: currentPost } = await supabase
    .from('blog_posts')
    .select('published')
    .eq('id', id)
    .single();

  // First update the post
  const { data: post, error: postError } = await supabase
    .from('blog_posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (postError) throw postError;

  // Then update categories if they were provided
  if (category_ids) {
    await updatePostCategories(id, category_ids);
  }

  // If post is being published for the first time, trigger notification
  if (post.published && (!currentPost || !currentPost.published)) {
    try {
      await sendBlogNotification(post.id);
    } catch (error) {
      console.error('Error sending blog notification:', error);
      // Don't throw - we don't want to fail post update if notification fails
    }
  }

  return post;
}

export async function deletePost(id: string) {
  // Categories will be automatically deleted due to ON DELETE CASCADE
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as BlogCategory[];
}

export async function createCategory(category: Omit<BlogCategory, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
}