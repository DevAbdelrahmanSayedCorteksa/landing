import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { Manrope, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import localFont from "next/font/local";
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

// IBM Plex Sans Arabic for Arabic/Persian body text
const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

// PingAR+LT for Arabic/Persian headings (local font)
const pingAR = localFont({
  src: [
    {
      path: "../public/font-ar/PingAR+LT-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-Heavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/font-ar/PingAR+LT-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-ping-ar",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://corteksa.com"),
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
        className={`${manrope.variable} ${inter.variable} ${pingAR.variable} ${ibmPlexArabic.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
