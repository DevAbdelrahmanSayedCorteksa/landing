import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import { Manrope, Inter, Cairo, Tajawal } from "next/font/google";
import { rtlLocales, defaultLocale, Locale } from "@/i18n/routing";
import "./globals.css";

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

// Cairo for Arabic/Persian headings
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Tajawal for Arabic/Persian body text
const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("CORTEKSA_LOCALE")?.value || defaultLocale) as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${inter.variable} ${cairo.variable} ${tajawal.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              richColors
              expand={false}
              visibleToasts={5}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
