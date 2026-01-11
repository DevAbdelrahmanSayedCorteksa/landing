"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavAndFooter = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password";

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main className="bg-background text-foreground">{children}</main>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}
