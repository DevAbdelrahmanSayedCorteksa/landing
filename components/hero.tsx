"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import { LandingImages } from "./landing-images";
import { GradientDivider } from "./gradient-divider";

export const Hero = () => {
  const t = useTranslations("hero");

  return (
    <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
      <Container>
        <Heading as="h1">{t("title")}</Heading>

        <Subheading className="py-8">{t("subtitle")}</Subheading>
        <div className="flex items-center gap-6">
          <Button className="shadow-brand">{t("cta")}</Button>
          <Button asChild variant="outline">
            <Link href="/features">{t("secondaryCta")}</Link>
          </Button>
        </div>
        <LandingImages />
      </Container>
      <GradientDivider />
    </section>
  );
};
