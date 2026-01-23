"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { SignupForm } from "@/components/signup-form";
import { LandingImages } from "@/components/landing-images";
import { Logo } from "@/components/logo";
import { PageTransition } from "@/components/page-transition";
import { getToken } from "@/lib/services/AuthLocalService";
import { rtlLocales, Locale } from "@/i18n/routing";

export function SignupClient() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const t = useTranslations("signup");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Show nothing while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen grid lg:grid-cols-2 bg-background relative" dir={isRTL ? "rtl" : "ltr"}>
        {/* Logo - Top Corner */}
        <div className="absolute top-6 start-6 z-50">
          <Logo />
        </div>

        {/* Left Section - Form */}
        <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 lg:border-e border-border">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <Heading as="h1" className="text-2xl md:text-3xl lg:text-4xl mb-2">
                {t("title")}
              </Heading>
              <Subheading className="text-base">
                {t("subtitle")}
              </Subheading>
            </div>
            <SignupForm />
          </div>
        </div>

        {/* Right Section - Images */}
        <section className="hidden lg:flex flex-col justify-start pt-8 md:pt-12 lg:pt-16 relative overflow-hidden min-h-screen">
          <div className="w-full px-8 md:px-12 lg:px-16 mb-16">
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
    </PageTransition>
  );
}
