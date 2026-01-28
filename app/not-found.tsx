import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Unbounded } from "next/font/google";
import { cn } from "@/lib/utils";

const unbounded = Unbounded({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 - Page Not Found | Corteksa",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

// Simple logo component for 404 page (without next-intl dependency)
function NotFoundLogo() {
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

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo */}
      <header className="py-6">
        <Container>
          <NotFoundLogo />
        </Container>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <Container className="text-center py-20">
          {/* 404 Number */}
          <div className="mb-8">
            <span className="text-[150px] md:text-[200px] lg:text-[250px] font-display font-bold text-neutral-100 dark:text-neutral-800 leading-none select-none">
              404
            </span>
          </div>

          {/* Heading */}
          <Heading as="h1" className="mb-4">
            Page Not Found
          </Heading>

          {/* Subheading */}
          <Subheading className="mx-auto mb-8 max-w-md">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved or doesn't exist anymore.
          </Subheading>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="shadow-brand">
              <Link href="/en">Go Back Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/en/contact">Contact Support</Link>
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
