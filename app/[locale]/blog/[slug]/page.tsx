import type { Metadata } from "next";
import { BlogPostClient } from "./blog-post-client";
import { BlogService } from "@/lib/services/BlogService";
import { notFound } from "next/navigation";
import { ArticleSchema, BreadcrumbSchema, generateAlternates } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found - Corteksa Blog",
    };
  }

  // Generate hreflang alternates for blog post
  const alternates = generateAlternates(`/blog/${slug}`, locale as Locale);

  return {
    title: `${post.title} - Corteksa Blog`,
    description: post.excerpt,
    alternates,
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
  const { slug, locale } = await params;
  const post = await BlogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await BlogService.getRelatedPosts(
    slug,
    post.category.slug,
    3
  );

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: "Home", url: "" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ];

  return (
    <>
      {/* Article Schema for rich snippets */}
      <ArticleSchema
        locale={locale as Locale}
        title={post.title}
        description={post.excerpt}
        image={post.featuredImage}
        datePublished={post.publishedAt}
        authorName={post.author.name}
        slug={slug}
      />
      {/* Breadcrumb Schema for navigation */}
      <BreadcrumbSchema locale={locale as Locale} items={breadcrumbItems} />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}

// Generate static params for static generation
export async function generateStaticParams() {
  const posts = await BlogService.getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
