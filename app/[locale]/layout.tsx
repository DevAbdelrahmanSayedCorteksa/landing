import { notFound } from "next/navigation";
import { setRequestLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing, Locale, locales } from "@/i18n/routing";
import { LayoutContent } from "@/components/layout-content";
import { LocaleDirection } from "@/components/locale-direction";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo";
import type { Metadata } from "next";

const BASE_URL = "https://corteksa.com";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate dynamic metadata with hreflang for each locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Generate hreflang alternates for all locales
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    languages[l] = `${BASE_URL}/${l}`;
  });

  return {
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for this locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {/* SEO Schema Markup */}
      <OrganizationSchema locale={locale as Locale} />
      <WebSiteSchema locale={locale as Locale} />
      <LocaleDirection />
      <LayoutContent>{children}</LayoutContent>
    </NextIntlClientProvider>
  );
}
