import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token and OTP flag from cookies
  const token = request.cookies.get("corteksa_auth_token")?.value;
  const isOtp = request.cookies.get("isOtp")?.value === "true";

  // Define route categories
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/pricing", "/terms", "/privacy"];
  const authRoutes = ["/login", "/signup", "/forgot-password"];
  const protectedRoutes = ["/multi-step-form", "/dashboard"];
  const otpRoute = "/otp";

  // Allow public routes for everyone
  if (publicRoutes.includes(pathname)) {
    // If user has token and no OTP pending, redirect away from auth pages
    if (token && !isOtp && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/multi-step-form", request.url));
    }
    return NextResponse.next();
  }

  // Handle OTP route
  if (pathname === otpRoute) {
    // Only allow access if user has token with OTP pending
    if (token && isOtp) {
      return NextResponse.next();
    }
    // Redirect to login if no valid OTP session
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // No token - redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Token with OTP pending - redirect to OTP
    if (isOtp) {
      return NextResponse.redirect(new URL("/otp", request.url));
    }
    // Valid token - allow access
    return NextResponse.next();
  }

  // Allow all other routes
  return NextResponse.next();
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
