import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Run intl middleware first to handle locale
  const intlResponse = intlMiddleware(request);

  // Extract the actual path without locale prefix for route checks
  const localePattern = new RegExp(`^/(${routing.locales.join("|")})`);
  const pathWithoutLocale = pathname.replace(localePattern, "") || "/";

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
  if (publicRoutes.includes(pathWithoutLocale)) {
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
