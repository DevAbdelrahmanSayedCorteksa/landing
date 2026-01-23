import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Map country codes to locales
const countryToLocale: Record<string, string> = {
  // Turkish
  TR: "tr",
  // Arabic-speaking countries
  SA: "ar", // Saudi Arabia
  AE: "ar", // UAE
  EG: "ar", // Egypt
  KW: "ar", // Kuwait
  QA: "ar", // Qatar
  BH: "ar", // Bahrain
  OM: "ar", // Oman
  JO: "ar", // Jordan
  LB: "ar", // Lebanon
  SY: "ar", // Syria
  IQ: "ar", // Iraq
  YE: "ar", // Yemen
  LY: "ar", // Libya
  SD: "ar", // Sudan
  // Persian-speaking countries
  IR: "fa", // Iran
  AF: "fa", // Afghanistan (Dari)
  // Russian-speaking countries
  RU: "ru", // Russia
  BY: "ru", // Belarus
  KZ: "ru", // Kazakhstan
  KG: "ru", // Kyrgyzstan
  // French-speaking countries
  FR: "fr", // France
  BE: "fr", // Belgium
  CH: "fr", // Switzerland
  CA: "fr", // Canada (could be en too)
  MA: "fr", // Morocco (also ar)
  TN: "fr", // Tunisia (also ar)
  DZ: "fr", // Algeria (also ar)
  SN: "fr", // Senegal
  CI: "fr", // Ivory Coast
};

// Get locale from country code
function getLocaleFromCountry(countryCode: string | null): string | null {
  if (!countryCode) return null;
  return countryToLocale[countryCode.toUpperCase()] || null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if URL has a locale prefix
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);
  const hasLocalePrefix = localePattern.test(pathname);

  // If no locale prefix, detect locale and redirect
  if (!hasLocalePrefix) {
    // Check for existing locale cookie first
    const localeCookie = request.cookies.get("CORTEKSA_LOCALE")?.value;
    if (localeCookie && routing.locales.includes(localeCookie as any)) {
      // User has a saved preference, redirect to that locale
      const url = request.nextUrl.clone();
      url.pathname = `/${localeCookie}${pathname}`;
      return NextResponse.redirect(url);
    }

    // Try to get country from Vercel's geo headers (works in production)
    let country = request.headers.get("x-vercel-ip-country");

    // For local development, try to get country from IP
    // You can also use request.geo?.country on Vercel
    if (!country && process.env.NODE_ENV === "development") {
      // In development, you can test by setting this manually
      // or use a geolocation API
      country = null; // Will fall back to Accept-Language
    }

    // Get locale from country
    const countryLocale = getLocaleFromCountry(country);

    if (countryLocale) {
      // Redirect to country-based locale
      const url = request.nextUrl.clone();
      url.pathname = `/${countryLocale}${pathname}`;
      const response = NextResponse.redirect(url);
      // Set cookie to remember this
      response.cookies.set("CORTEKSA_LOCALE", countryLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
      return response;
    }

    // Fall back to Accept-Language header detection via next-intl
    return intlMiddleware(request);
  }

  // From here, we have a locale prefix in the URL
  // Run intl middleware to handle locale routing
  const intlResponse = intlMiddleware(request);

  // Extract the actual path without locale prefix for route checks
  const pathWithoutLocale = pathname.replace(localePattern, "/").replace(/^\/$/, "/") || "/";

  // Get auth token and OTP flag from cookies
  const token = request.cookies.get("corteksa_auth_token")?.value;
  const isOtp = request.cookies.get("isOtp")?.value === "true";

  // Get current locale from path
  const localeMatch = pathname.match(localePattern);
  const currentLocale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Define route categories (without locale prefix)
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/pricing",
    "/terms",
    "/privacy",
    "/features",
    "/product",
    "/about",
    "/blog",
    "/contact",
    "/form",
  ];
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const protectedRoutes = ["/multi-step-form", "/dashboard"];
  const otpRoute = "/otp";

  // Allow public routes for everyone
  if (publicRoutes.includes(pathWithoutLocale) || pathWithoutLocale.startsWith("/blog/")) {
    // If user has token and no OTP pending, redirect away from auth pages
    if (token && !isOtp && authRoutes.includes(pathWithoutLocale)) {
      return NextResponse.redirect(new URL(`/${currentLocale}/multi-step-form`, request.url));
    }
    return intlResponse;
  }

  // Handle OTP route
  if (pathWithoutLocale === otpRoute) {
    // Only allow access if user has token with OTP pending
    if (token && isOtp) {
      return intlResponse;
    }
    // Redirect to login if no valid OTP session
    return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    // No token - redirect to login
    if (!token) {
      return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
    }
    // Token with OTP pending - redirect to OTP
    if (isOtp) {
      return NextResponse.redirect(new URL(`/${currentLocale}/otp`, request.url));
    }
    // Valid token - allow access
    return intlResponse;
  }

  // Allow all other routes
  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
