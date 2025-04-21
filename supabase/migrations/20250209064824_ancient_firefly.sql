/*
  # Preserve Blog Data While Fixing Schema

  1. Changes
    - Backup existing data
    - Recreate tables with proper structure
    - Restore data from backup
    - Set up proper constraints and indexes
    
  2. Security
    - Maintain RLS policies
    - Ensure proper access controls
*/

-- First, create temporary tables to store existing data
CREATE TEMP TABLE temp_blog_posts AS
SELECT * FROM blog_posts;

CREATE TEMP TABLE temp_blog_categories AS
SELECT * FROM blog_categories;

CREATE TEMP TABLE temp_blog_post_categories AS
SELECT * FROM blog_post_categories;

-- Recreate the tables with proper structure
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

CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Restore the data
INSERT INTO blog_posts 
SELECT * FROM temp_blog_posts
ON CONFLICT (id) DO UPDATE 
SET 
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  thumbnail_url = EXCLUDED.thumbnail_url,
  author_id = EXCLUDED.author_id,
  published = EXCLUDED.published,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

INSERT INTO blog_categories 
SELECT * FROM temp_blog_categories
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  created_at = EXCLUDED.created_at;

INSERT INTO blog_post_categories 
SELECT * FROM temp_blog_post_categories
ON CONFLICT (post_id, category_id) DO NOTHING;

-- Drop temporary tables
DROP TABLE temp_blog_posts;
DROP TABLE temp_blog_categories;
DROP TABLE temp_blog_post_categories;

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