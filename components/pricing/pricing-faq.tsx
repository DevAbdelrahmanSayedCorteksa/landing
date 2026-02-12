"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { EASE, FAQ_KEYS } from "./pricing-data";

function FAQQuestion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full rounded-2xl overflow-hidden border p-4 md:p-6 transition-all duration-200 text-start",
        open
          ? "border-primary/30 bg-white dark:bg-neutral-800/80 shadow-sm"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base md:text-lg font-bold font-display text-neutral-800 dark:text-neutral-200">
          {question}
        </h3>
        <div className={cn(
          "size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200",
          open ? "bg-primary/10 text-primary" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
        )}>
          <IconMinus
            className={cn(
              "size-4 absolute transition-all duration-200",
              open ? "scale-100 rotate-0" : "scale-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-4 absolute transition-all duration-200",
              open ? "scale-0 -rotate-90" : "scale-100 rotate-0"
            )}
          />
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <motion.p
          key={String(open)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
        >
          {answer}
        </motion.p>
      </motion.div>
    </button>
  );
}

export function PricingFaq() {
  const t = useTranslations("pricingPage");

  return (
    <section className="py-6 md:py-8 lg:py-12 bg-neutral-50/50 dark:bg-neutral-900/30">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          <div className="text-center mb-8 md:mb-10">
            <Heading>{t("faqTitle")}</Heading>
          </div>

          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {FAQ_KEYS.map((i) => (
              <FAQQuestion
                key={i}
                question={t(`faq${i}Q`)}
                answer={t(`faq${i}A`)}
              />
            ))}
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
