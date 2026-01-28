"use client";

import { useTranslations, useLocale } from "next-intl";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { OtpForm } from "@/components/otp-form";
import { LandingImages } from "@/components/landing-images";
import { LogoIcon } from "@/components/logo";
import { Link } from "@/i18n/routing";
import { rtlLocales, Locale } from "@/i18n/routing";

export function OtpClient() {
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const t = useTranslations("otp");

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background Glow - Top Corner */}
      <div
        className="absolute top-0 w-[300px] h-[300px] bg-primary/35 rounded-full blur-[100px] pointer-events-none"
        style={{
          left: isRTL ? "auto" : 0,
          right: isRTL ? 0 : "auto",
          transform: `translate(${isRTL ? "25%" : "-25%"}, -50%)`,
        }}
      />

      {/* Logo - Top Corner */}
      <Link href="/" className="absolute top-6 start-6 z-50">
        <LogoIcon className="w-12 h-12" />
      </Link>
      {/* Left Section - Form */}
      <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 lg:border-e border-border">
        <div className="w-full max-w-md space-y-8">
          {/* Heading */}
          <div className="text-center">
            <Heading as="h1" className="text-2xl md:text-3xl lg:text-4xl mb-2">
              {t("title")}
            </Heading>
            <Subheading className="text-base">
              {t("subtitle")}
            </Subheading>
          </div>

          {/* Form - No Card Wrapper */}
          <OtpForm />
        </div>
      </div>

      {/* Right Section - Images */}
      <section className="hidden lg:flex flex-col justify-start pt-8 md:pt-12 lg:pt-16 relative overflow-hidden min-h-screen">
        <div className="w-full px-8 md:px-12 lg:px-16 mb-16">
          {/* Title and Description */}
          <div className="text-start max-w-2xl">
            <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl mb-3">
              {t("sideTitle")}
            </Heading>
            <Subheading className="text-base">
              {t("sideSubtitle")}
            </Subheading>
          </div>
        </div>

        <div className="w-full">
          <LandingImages />
        </div>
      </section>
    </main>
  );
}
