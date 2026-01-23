import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["en", "ar", "tr", "ru", "fa", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const rtlLocales: Locale[] = ["ar", "fa"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
  ru: "Русский",
  fa: "فارسی",
  fr: "Français",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  localeCookie: {
    name: "CORTEKSA_LOCALE",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
