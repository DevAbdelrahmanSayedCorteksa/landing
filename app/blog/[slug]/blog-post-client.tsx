"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconArrowUp,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import { BlogPost } from "@/lib/types/blogTypes";
import { cn } from "@/lib/utils";
import "./blog-content.css";

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

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

// Table of Contents Component
function TableOfContents({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Table of Contents
        </span>
        <IconChevronDown
          className={cn(
            "size-4 text-neutral-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-2 bg-white dark:bg-neutral-800">
              <a href="#introduction" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
                Introduction
              </a>
              <a href="#features" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
                Key Features
              </a>
              <a href="#benefits" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
                Benefits
              </a>
              <a href="#conclusion" className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors">
                Conclusion
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// CTA Sidebar Card
function CTASidebarCard() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
      <h3 className="font-bold font-display text-lg text-neutral-900 dark:text-neutral-100 mb-4">
        Start using Corteksa today
      </h3>
      <ul className="space-y-3 mb-6">
        <li className="flex items-start gap-2">
          <IconCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage all your work in one place
          </span>
        </li>
        <li className="flex items-start gap-2">
          <IconCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Collaborate with your team
          </span>
        </li>
        <li className="flex items-start gap-2">
          <IconCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Use Corteksa for FREE—forever
          </span>
        </li>
      </ul>
      <Button className="w-full">Get Started</Button>
    </div>
  );
}

// Related Post Card
function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all"
    >
      <div className="relative h-32 overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-wider mb-2",
            getCategoryColor(post.category.slug)
          )}
        >
          {post.category.name}
        </p>
        <h4 className="font-bold font-display text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);

  // Scroll to top on mount - useLayoutEffect fires before paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [post.slug]);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 500);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - 2 Column Layout */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-10 md:pb-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back Link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary transition-colors mb-6"
              >
                <IconArrowLeft className="size-4" />
                Back to Blog
              </Link>

              {/* Category */}
              <p
                className={cn(
                  "text-sm font-bold uppercase tracking-wider mb-4",
                  getCategoryColor(post.category.slug)
                )}
              >
                {post.category.name}
              </p>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Date */}
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
                {formatDate(post.publishedAt)}
              </p>

              {/* CTA Button */}
              <Button size="lg">
                Get started with Corteksa
              </Button>
            </motion.div>

            {/* Right Side - Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Content Area - 2 Column Layout */}
      <section className="py-10 md:py-16 border-t border-neutral-200 dark:border-neutral-800">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16">
            {/* Left Column - Article Content */}
            <article className="blog-content">
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Right Column - Sidebar */}
            <aside className="space-y-6">
              <div className="lg:sticky lg:top-24">
                {/* Table of Contents */}
                <TableOfContents isOpen={tocOpen} onToggle={() => setTocOpen(!tocOpen)} />

                {/* CTA Card */}
                <div className="mt-6">
                  <CTASidebarCard />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-20 bg-neutral-50 dark:bg-neutral-900">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-center mb-10 text-neutral-900 dark:text-neutral-100">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Back to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
            aria-label="Back to top"
          >
            <IconArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
