import type { Metadata } from "next";
import { BlogPageClient } from "./blog-client";
import { generateAlternates, BreadcrumbSchema } from "@/components/seo";
import { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("/blog", locale as Locale);

  return {
    title: "Blog - Corteksa CRM",
    description:
      "Insights, updates, and best practices for modern business management. Stay informed with the latest from Corteksa.",
    alternates,
    openGraph: {
      title: "Blog - Corteksa CRM",
      description: "Expert insights on CRM, business automation, and industry trends.",
      type: "website",
      url: `https://corteksa.com/${locale}/blog`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Corteksa CRM",
      description: "Expert insights on CRM, business automation, and industry trends.",
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <BreadcrumbSchema
        locale={locale as Locale}
        items={[
          { name: "Home", url: "" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <BlogPageClient />
    </>
  );
}
