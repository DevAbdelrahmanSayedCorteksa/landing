"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Unbounded } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const unbounded = Unbounded({ subsets: ["latin"] });

// Simple logo component for error page (without next-intl dependency)
function ErrorLogo() {
  return (
    <Link href="/en" className="flex items-center gap-2">
      <Image
        src="/Corteksa.svg"
        alt="Corteksa Logo"
        width={28}
        height={28}
        className="w-7 h-7"
      />
      <span
        className={cn(
          "text-base font-semibold text-neutral-600 dark:text-neutral-200",
          unbounded.className
        )}
      >
        Corteksa
      </span>
    </Link>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error(error);
  }, [error]);

  // In development, show the actual error for debugging
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <header className="py-6">
          <Container>
            <ErrorLogo />
          </Container>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Container className="py-20">
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Development Error
              </h1>
              <p className="text-red-800 dark:text-red-200 mb-4 font-mono text-sm break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-red-600 dark:text-red-400 text-xs mb-4">
                  Error ID: {error.digest}
                </p>
              )}
              <Button onClick={reset} variant="outline" className="border-red-300">
                Try Again
              </Button>
            </div>
          </Container>
        </div>
      </main>
    );
  }

  // Production error page with same design as 404
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo */}
      <header className="py-6">
        <Container>
          <ErrorLogo />
        </Container>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <Container className="text-center py-20">
          {/* 500 Number */}
          <div className="mb-8">
            <span className="text-[150px] md:text-[200px] lg:text-[250px] font-display font-bold text-neutral-100 dark:text-neutral-800 leading-none select-none">
              500
            </span>
          </div>

          {/* Heading */}
          <Heading as="h1" className="mb-4">
            Something Went Wrong
          </Heading>

          {/* Subheading */}
          <Subheading className="mx-auto mb-8 max-w-md">
            We encountered an unexpected error. Please try again or contact
            support if the problem persists.
          </Subheading>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={reset} className="shadow-brand">
              Try Again
            </Button>
            <Button asChild variant="outline">
              <Link href="/en">Go Back Home</Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Here are some helpful links:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link
                href="/en/about"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/en/product"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                href="/en/pricing"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/en/blog"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/en/contact"
                className="text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}
