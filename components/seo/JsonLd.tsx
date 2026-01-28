import { locales, type Locale } from "@/i18n/routing";

const BASE_URL = "https://corteksa.com";

// Organization Schema - for the company/brand
interface OrganizationSchemaProps {
  locale: Locale;
}

export function OrganizationSchema({ locale }: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Corteksa",
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Corteksa is a flexible workspace to manage projects, clients, and documents in one place. Powered by Cortex AI.",
    sameAs: [
      // Add your social media links here
      // "https://twitter.com/corteksa",
      // "https://linkedin.com/company/corteksa",
      // "https://facebook.com/corteksa",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${BASE_URL}/${locale}/contact`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema - for the website with search action
interface WebSiteSchemaProps {
  locale: Locale;
  siteName?: string;
}

export function WebSiteSchema({ locale, siteName = "Corteksa" }: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: `${BASE_URL}/${locale}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/${locale}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema - for blog posts
interface ArticleSchemaProps {
  locale: Locale;
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  slug: string;
}

export function ArticleSchema({
  locale,
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  slug,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image.startsWith("http") ? image : `${BASE_URL}${image}`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
    },
    publisher: {
      "@type": "Organization",
      name: "Corteksa",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${locale}/blog/${slug}`,
    },
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema - for FAQ sections
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
  locale: Locale;
}

export function FAQSchema({ items, locale }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema - for navigation path
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
  locale: Locale;
}

export function BreadcrumbSchema({ items, locale }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}/${locale}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Product/SaaS Schema - for pricing page
interface ProductSchemaProps {
  locale: Locale;
  name: string;
  description: string;
  offers?: {
    name: string;
    price: string;
    priceCurrency: string;
    description: string;
  }[];
}

export function ProductSchema({ locale, name, description, offers }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: name,
    description: description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    url: `${BASE_URL}/${locale}`,
    offers: offers?.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      description: offer.description,
      url: `${BASE_URL}/${locale}/pricing`,
    })) || {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      url: `${BASE_URL}/${locale}/pricing`,
    },
    publisher: {
      "@type": "Organization",
      name: "Corteksa",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper to generate hreflang alternates for metadata
export function generateAlternates(pathname: string, currentLocale: Locale) {
  const languages: Record<string, string> = {};

  locales.forEach((locale) => {
    languages[locale] = `${BASE_URL}/${locale}${pathname}`;
  });

  return {
    canonical: `${BASE_URL}/${currentLocale}${pathname}`,
    languages,
  };
}

// Export BASE_URL for use in other files
export { BASE_URL };
