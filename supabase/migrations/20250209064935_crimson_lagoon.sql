/*
  # Restore Blog Posts and Fix Schema

  1. Changes
    - Create blog tables if they don't exist
    - Preserve any existing data
    - Set up proper indexes and constraints
    
  2. Security
    - Enable RLS
    - Set up access policies
*/

-- Create blog_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  thumbnail_url text,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_post_categories junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
DO $$ BEGIN
  CREATE POLICY "Admins have full access to blog posts"
    ON blog_posts
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins have full access to blog categories"
    ON blog_categories
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins have full access to blog post categories"
    ON blog_post_categories
    TO authenticated
    USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
    WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for public read access
DO $$ BEGIN
  CREATE POLICY "Anyone can read published blog posts"
    ON blog_posts
    FOR SELECT
    TO public
    USING (published = true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can read blog categories"
    ON blog_categories
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can read blog post categories"
    ON blog_post_categories
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);