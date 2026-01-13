import { BlogPost, BlogCategory } from "@/lib/types/blogTypes";
import { blogPosts, blogCategories } from "@/lib/data/blogData";
// import { $api } from "@/lib/services/apiClient"; // Uncomment for API integration

// Flag to switch between mock and API data
const USE_MOCK_DATA = true;

// Mock implementations
const mockGetAllPosts = (): BlogPost[] => {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

const mockGetPostBySlug = (slug: string): BlogPost | null => {
  return blogPosts.find((post) => post.slug === slug) || null;
};

const mockGetPostsByCategory = (categorySlug: string): BlogPost[] => {
  return blogPosts
    .filter((post) => post.category.slug === categorySlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};

const mockGetAllCategories = (): BlogCategory[] => {
  return blogCategories;
};

const mockGetRelatedPosts = (
  currentSlug: string,
  categorySlug: string,
  limit: number = 3
): BlogPost[] => {
  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.category.slug === categorySlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

// Export service functions
export const BlogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    if (USE_MOCK_DATA) return mockGetAllPosts();
    // Future API integration:
    // const response = await $api.get<BlogPostsResponse>('/v1/blog/posts');
    // return response.posts;
    return mockGetAllPosts();
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    if (USE_MOCK_DATA) return mockGetPostBySlug(slug);
    // Future API integration:
    // const response = await $api.get<BlogPostResponse>(`/v1/blog/posts/${slug}`);
    // return response.post;
    return mockGetPostBySlug(slug);
  },

  getPostsByCategory: async (categorySlug: string): Promise<BlogPost[]> => {
    if (USE_MOCK_DATA) return mockGetPostsByCategory(categorySlug);
    // Future API integration:
    // const response = await $api.get<BlogPostsResponse>(`/v1/blog/posts?category=${categorySlug}`);
    // return response.posts;
    return mockGetPostsByCategory(categorySlug);
  },

  getAllCategories: async (): Promise<BlogCategory[]> => {
    if (USE_MOCK_DATA) return mockGetAllCategories();
    // Future API integration:
    // const response = await $api.get<BlogCategoriesResponse>('/v1/blog/categories');
    // return response.categories;
    return mockGetAllCategories();
  },

  getRelatedPosts: async (
    currentSlug: string,
    categorySlug: string,
    limit?: number
  ): Promise<BlogPost[]> => {
    if (USE_MOCK_DATA) return mockGetRelatedPosts(currentSlug, categorySlug, limit);
    // Future API integration:
    // const response = await $api.get<BlogPostsResponse>(
    //   `/v1/blog/posts?exclude=${currentSlug}&category=${categorySlug}&limit=${limit}`
    // );
    // return response.posts;
    return mockGetRelatedPosts(currentSlug, categorySlug, limit);
  },
};
