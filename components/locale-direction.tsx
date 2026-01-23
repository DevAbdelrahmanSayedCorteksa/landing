"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { rtlLocales, Locale } from "@/i18n/routing";

export function LocaleDirection() {
  const locale = useLocale() as Locale;

  useEffect(() => {
    const isRTL = rtlLocales.includes(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
