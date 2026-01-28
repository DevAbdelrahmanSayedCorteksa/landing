import { NextResponse } from "next/server";
import { locales } from "@/i18n/routing";
import { BlogService } from "@/lib/services/BlogService";

const BASE_URL = "https://corteksa.com";

export async function GET() {
  // Static pages
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/pricing",
    "/product",
    "/contact",
    "/privacy",
  ];

  // Generate all URLs
  const urls: string[] = [];

  // Add static pages for all locales
  for (const locale of locales) {
    for (const page of staticPages) {
      urls.push(`${BASE_URL}/${locale}${page}`);
    }
  }

  // Add blog posts for all locales
  try {
    const posts = await BlogService.getAllPosts();
    for (const locale of locales) {
      for (const post of posts) {
        urls.push(`${BASE_URL}/${locale}/blog/${post.slug}`);
      }
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  // Generate clean XML like Framer
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
