/*
  # Create Blog Tables

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `excerpt` (text)
      - `thumbnail_url` (text)
      - `author_id` (uuid)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `created_at` (timestamptz)
    
    - `blog_post_categories`
      - `post_id` (uuid, references blog_posts)
      - `category_id` (uuid, references blog_categories)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create blog_posts table if it doesn't exist
DO $$ BEGIN
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
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create blog_categories table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS blog_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create blog_post_categories junction table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS blog_post_categories (
    post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable RLS if not already enabled
DO $$ BEGIN
  ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins have full access to blog posts" ON blog_posts;
  DROP POLICY IF EXISTS "Admins have full access to blog categories" ON blog_categories;
  DROP POLICY IF EXISTS "Admins have full access to blog post categories" ON blog_post_categories;
  DROP POLICY IF EXISTS "Anyone can read published blog posts" ON blog_posts;
  DROP POLICY IF EXISTS "Anyone can read blog categories" ON blog_categories;
  DROP POLICY IF EXISTS "Anyone can read blog post categories" ON blog_post_categories;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create new policies
CREATE POLICY "Admins have full access to blog posts"
  ON blog_posts
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');

CREATE POLICY "Admins have full access to blog categories"
  ON blog_categories
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');

CREATE POLICY "Admins have full access to blog post categories"
  ON blog_post_categories
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'hello@dhruvaryan.com');

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Anyone can read blog categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read blog post categories"
  ON blog_post_categories
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
  CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;