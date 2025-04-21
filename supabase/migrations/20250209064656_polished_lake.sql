/*
  # Fix Blog Tables Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `content` (text)
      - `excerpt` (text)
      - `thumbnail_url` (text)
      - `author_id` (uuid, references auth.users)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `slug` (text, unique, not null)
      - `created_at` (timestamptz)
    
    - `blog_post_categories`
      - `post_id` (uuid, references blog_posts)
      - `category_id` (uuid, references blog_categories)
      - Primary key on (post_id, category_id)

  2. Security
    - Enable RLS on all tables
    - Admin policies for full access
    - Public read access for published posts
    - Public read access for categories

  3. Performance
    - Indexes on frequently queried columns
*/

-- Drop existing tables if they exist to ensure clean state
DROP TABLE IF EXISTS blog_post_categories CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS blog_categories CASCADE;

-- Create blog_posts table
CREATE TABLE blog_posts (
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

-- Create blog_categories table
CREATE TABLE blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE blog_post_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
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

-- Create policies for public read access
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
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);