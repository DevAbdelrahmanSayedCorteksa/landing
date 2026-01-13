// Blog Author interface
export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

// Blog Category interface
export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

// Blog Post interface
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  author: Author;
  publishedAt: string;
  readTime: number;
  featuredImage: string;
}

// API Response types for future backend integration
export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BlogPostResponse {
  post: BlogPost;
}

export interface BlogCategoriesResponse {
  categories: BlogCategory[];
}
