import { MetadataRoute } from "next";

const BASE_URL = "https://corteksa.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Auth pages - should not be indexed
          "/*/login",
          "/*/signup",
          "/*/forgot-password",
          "/*/otp",
          "/*/form",
          // API routes
          "/api/",
          // Private/internal paths
          "/_next/",
          "/private/",
        ],
      },
      {
        // Allow AI crawlers (optional - remove if you don't want AI to crawl)
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/*/login", "/*/signup", "/*/forgot-password", "/*/otp", "/*/form"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/*/login", "/*/signup", "/*/forgot-password", "/*/otp", "/*/form"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
