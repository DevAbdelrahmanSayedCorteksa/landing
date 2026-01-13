"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BlogService } from "@/lib/services/BlogService";
import { BlogPost, BlogCategory } from "@/lib/types/blogTypes";

// Format date helper
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get category color
const getCategoryColor = (categorySlug: string): string => {
  const colors: Record<string, string> = {
    technology: "text-blue-600 dark:text-blue-400",
    "product-updates": "text-purple-600 dark:text-purple-400",
    "industry-insights": "text-orange-600 dark:text-orange-400",
    "company-news": "text-green-600 dark:text-green-400",
  };
  return colors[categorySlug] || "text-primary";
};

// Featured Post Card (Hero Right Side)
function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>
      {/* Category */}
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-wider mb-2",
          getCategoryColor(post.category.slug)
        )}
      >
        {post.category.name}
      </p>
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold font-display text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors">
        {post.title}
      </h2>
    </Link>
  );
}

// Blog Card Component
function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Category */}
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-wider mb-2",
            getCategoryColor(post.category.slug)
          )}
        >
          {post.category.name}
        </p>

        {/* Title */}
        <h3 className="text-base md:text-lg font-bold font-display text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
      </Link>
    </motion.article>
  );
}

// Filter Toggle Button
function FilterToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
        active
          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-4" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-3" />
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2" />
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

// Main Blog Page Client Component
export function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"recent" | "popular">("recent");

  // Scroll to top on mount - useLayoutEffect fires before paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [allPosts, allCategories] = await Promise.all([
        BlogService.getAllPosts(),
        BlogService.getAllCategories(),
      ]);
      setPosts(allPosts);
      setCategories(allCategories);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Get featured post (first one)
  const featuredPost = posts[0];
  // Get remaining posts for grid
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-10 md:pb-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Side - Text & Subscribe */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-6">
                <span className="text-neutral-900 dark:text-neutral-100">
                  Business
                </span>{" "}
                <span className="text-neutral-500 dark:text-neutral-400">
                  tips &
                </span>
                <br />
                <span className="text-neutral-500 dark:text-neutral-400">
                  trends, delivered.
                </span>
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
                Join productivity enthusiasts from around the world that receive
                our newsletter — the Corteksa Blog Newsletter.
              </p>

              {/* Subscribe Form */}
              <div className="flex gap-3 mb-8 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1"
                />
                <Button>Subscribe</Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Follow us on:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Post */}
            <div>
              {!isLoading && featuredPost && (
                <FeaturedPostCard post={featuredPost} />
              )}
              {isLoading && (
                <div className="animate-pulse">
                  <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-700 rounded-2xl mb-4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-3" />
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Articles Section */}
      <section className="py-10 md:py-16 border-t border-neutral-200 dark:border-neutral-800">
        <Container>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Articles
            </h2>
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-full p-1">
              <FilterToggle
                active={filter === "recent"}
                label="Recent"
                onClick={() => setFilter("recent")}
              />
              <FilterToggle
                active={filter === "popular"}
                label="Popular"
                onClick={() => setFilter("popular")}
              />
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Load More */}
          {!isLoading && gridPosts.length > 6 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load more articles
              </Button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
