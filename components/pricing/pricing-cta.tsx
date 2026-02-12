"use client";

import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IconArrowRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { EASE } from "./pricing-data";

export function PricingCta() {
  const t = useTranslations("pricingPage");

  return (
    <section className="py-6 md:py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <Heading className="mb-4">{t("heroTagline")}</Heading>
            <Subheading className="mx-auto mb-8">
              {t("heroSubtitle")}
            </Subheading>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="shadow-brand" asChild>
                <Link href="/signup">{t("heroCta")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact" className="gap-2">
                  {t("contactSales")}
                  <IconArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
