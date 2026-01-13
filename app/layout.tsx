import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { LayoutContent } from "@/components/layout-content";
import { Toaster } from "sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agenforce Marketing Template - Aceternity UI Pro",
  description:
    "Agenforce is a multipurpose marketing template built with Next.js, Typescript, Tailwind CSS and Motion for react.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${inter.variable} antialiased  `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutContent>{children}</LayoutContent>
          <Toaster
            position="bottom-right"
            richColors
            expand={false}
            visibleToasts={5}
          />
        </ThemeProvider>
        <script src="https://www.wibbot.com/api/embed?wc=GOdmgkaI1cIF0T0JsH6A3N-WQ1r5-IT8" defer></script>
      </body>
    </html>
  );
}
