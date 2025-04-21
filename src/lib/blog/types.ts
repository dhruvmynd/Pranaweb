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
  categories?: { category: BlogCategory }[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail_url: string;
  published: boolean;
  category_ids: string[];
}