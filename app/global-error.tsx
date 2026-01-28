"use client";

import { Unbounded, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const unbounded = Unbounded({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

// Global error page must include its own html and body tags
// because it replaces the root layout when there's an error
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-white dark:bg-neutral-950")}>
        <main className="min-h-screen flex flex-col">
          {/* Header with Logo */}
          <header className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <a href="/en" className="flex items-center gap-2">
                <img
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
              </a>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
              {isDev ? (
                // Development: Show actual error
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-2xl mx-auto">
                  <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                    Global Error (Development)
                  </h1>
                  <p className="text-red-800 dark:text-red-200 mb-4 font-mono text-sm break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-red-600 dark:text-red-400 text-xs mb-4">
                      Error ID: {error.digest}
                    </p>
                  )}
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-white dark:bg-neutral-800 border border-red-300 dark:border-red-700 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                // Production: Nice error page
                <>
                  {/* 500 Number */}
                  <div className="mb-8">
                    <span className="text-[150px] md:text-[200px] lg:text-[250px] font-bold text-neutral-100 dark:text-neutral-800 leading-none select-none">
                      500
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                    Something Went Wrong
                  </h1>

                  {/* Subheading */}
                  <p className="text-neutral-500 dark:text-neutral-400 mx-auto mb-8 max-w-md">
                    We encountered an unexpected error. Please try again or
                    contact support if the problem persists.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={reset}
                      className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium hover:opacity-90 transition-opacity shadow-lg"
                    >
                      Try Again
                    </button>
                    <a
                      href="/en"
                      className="px-6 py-3 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-md font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Go Back Home
                    </a>
                  </div>

                  {/* Helpful Links */}
                  <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      Here are some helpful links:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                      <a
                        href="/en/about"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        About Us
                      </a>
                      <a
                        href="/en/product"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Products
                      </a>
                      <a
                        href="/en/pricing"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Pricing
                      </a>
                      <a
                        href="/en/blog"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Blog
                      </a>
                      <a
                        href="/en/contact"
                        className="text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Contact
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
