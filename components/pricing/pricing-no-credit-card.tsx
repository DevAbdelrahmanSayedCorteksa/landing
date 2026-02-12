"use client";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { IconCircleCheckFilled, IconArrowRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import CreditCard from "@/components/credit-card-1";
import { EASE } from "./pricing-data";

export function PricingNoCreditCard() {
  const t = useTranslations("pricingPage");

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-100 via-purple-50 to-neutral-100 dark:from-neutral-900 dark:via-purple-950/30 dark:to-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
          {/* Background orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 md:p-12 lg:p-16">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <IconCircleCheckFilled className="size-4" />
                {t("noCreditCardBadge")}
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
                {t("noCreditCardTitle")}
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-md">
                {t("noCreditCardDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link href="/signup">{t("heroCta")}</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact" className="gap-2">
                    {t("contactSales")}
                    <IconArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Credit card visual */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative">
                {/* Strike-through line over the card */}
                <CreditCard
                  cardHolder="YOUR NAME"
                  cardNumber="0000 0000 0000 0000"
                  expiryDate="--/--"
                  variant="gradient"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
