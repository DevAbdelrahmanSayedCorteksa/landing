"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { LandingImages } from "./landing-images";
import { GradientDivider } from "./gradient-divider";

export const Speed = () => {
  const t = useTranslations("speed");

  return (
    <section className="pt-10 md:pt-20 lg:pt-10 relative overflow-hidden">
      <Container>
        <Heading>
          {t("title")} <br />
          {t("title2")}
        </Heading>

        <Subheading className="py-8">{t("subtitle")}</Subheading>

        <LandingImages
          firstImageSrc={"https://assets.aceternity.com/screenshots/3.jpg"}
          secondImageSrc={"https://assets.aceternity.com/screenshots/4.jpg"}
        />
      </Container>
      <GradientDivider />
    </section>
  );
};
