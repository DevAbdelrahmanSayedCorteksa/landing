import type { Metadata } from "next";
import { BlogPostClient } from "./blog-post-client";
import { BlogService } from "@/lib/services/BlogService";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found - Corteksa Blog",
    };
  }

  return {
    title: `${post.title} - Corteksa Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await BlogService.getRelatedPosts(
    slug,
    post.category.slug,
    3
  );

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}

// Generate static params for static generation
export async function generateStaticParams() {
  const posts = await BlogService.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
