import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
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
  title: {
    default: "Corteksa - The Brain Behind Your Business",
    template: "%s | Corteksa",
  },
  description:
    "Corteksa is a flexible workspace to manage projects, clients, and documents in one place. Powered by Cortex AI to help you work smarter, not harder.",
  keywords: [
    "CRM",
    "project management",
    "client management",
    "AI assistant",
    "Cortex AI",
    "business automation",
    "task management",
    "document management",
    "team collaboration",
    "Arabic CRM",
    "bilingual CRM",
  ],
  authors: [{ name: "Corteksa" }],
  creator: "Corteksa",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://corteksa.com",
    siteName: "Corteksa",
    title: "Corteksa - The Brain Behind Your Business",
    description:
      "Corteksa is a flexible workspace to manage projects, clients, and documents in one place. Powered by Cortex AI to help you work smarter, not harder.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Corteksa - The Brain Behind Your Business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corteksa - The Brain Behind Your Business",
    description:
      "Corteksa is a flexible workspace to manage projects, clients, and documents in one place. Powered by Cortex AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${inter.variable} antialiased  `}>
        <QueryProvider>
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
        </QueryProvider>
        {/* <script src="https://www.wibbot.com/api/embed?wc=bJlBeyUiS9sWpHkFPR3-bHKU77PRBvhk" defer></script> */}
             </body>
    </html>
  );
}
