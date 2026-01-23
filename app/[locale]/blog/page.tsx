import type { Metadata } from "next";
import { BlogPageClient } from "./blog-client";

export const metadata: Metadata = {
  title: "Blog - Corteksa CRM",
  description:
    "Insights, updates, and best practices for modern business management. Stay informed with the latest from Corteksa.",
  openGraph: {
    title: "Blog - Corteksa CRM",
    description: "Expert insights on CRM, business automation, and industry trends.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
