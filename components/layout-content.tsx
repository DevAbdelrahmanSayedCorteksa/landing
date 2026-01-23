"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Routes where navbar and footer should be hidden
const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/otp",
  "/multi-step-form",
  "/reset-password",
];

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current path matches any auth route (with or without locale prefix)
  const hideNavAndFooter = authRoutes.some(
    (route) => pathname === route || pathname.endsWith(route)
  );

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main className="bg-background text-foreground">{children}</main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}
