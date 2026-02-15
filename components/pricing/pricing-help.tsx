"use client";

import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  IconHeadset,
  IconPlayerPlay,
  IconMessageCircle,
  IconArrowRight,
  IconQuestionMark,
} from "@tabler/icons-react";
import { EASE } from "./pricing-data";

const HELP_ITEMS = [
  {
    titleKey: "helpSalesTitle",
    descKey: "helpSalesDesc",
    ctaKey: "helpSalesCta",
    href: "/contact",
    icon: IconHeadset,
    color: "text-primary",
    ringColor: "ring-primary/20 group-hover:ring-primary/40",
    bgColor: "bg-primary/10 group-hover:bg-primary/15",
  },
  {
    titleKey: "helpDemoTitle",
    descKey: "helpDemoDesc",
    ctaKey: "helpDemoCta",
    href: "/contact",
    icon: IconPlayerPlay,
    color: "text-blue-500",
    ringColor: "ring-blue-500/20 group-hover:ring-blue-500/40",
    bgColor: "bg-blue-500/10 group-hover:bg-blue-500/15",
  },
  {
    titleKey: "helpChatTitle",
    descKey: "helpChatDesc",
    ctaKey: "helpChatCta",
    href: "/contact",
    icon: IconMessageCircle,
    color: "text-emerald-500",
    ringColor: "ring-emerald-500/20 group-hover:ring-emerald-500/40",
    bgColor: "bg-emerald-500/10 group-hover:bg-emerald-500/15",
  },
] as const;

export function PricingHelp() {
  const t = useTranslations("pricingPage");

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Gradient border wrapper */}
          <div className="rounded-3xl p-[1px] bg-gradient-to-br from-primary/40 via-purple-400/20 to-blue-500/40 max-w-3xl mx-auto">
            <div className="rounded-[calc(1.5rem-1px)] bg-white dark:bg-neutral-950 overflow-hidden">

              {/* Top section — heading */}
              <div className="relative px-8 pt-10 pb-8 text-center overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                {/* Floating question mark */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg shadow-primary/25 mb-6"
                >
                  <IconQuestionMark className="size-8" strokeWidth={2.5} />
                </motion.div>

                <h2 className="relative text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
                  {t("helpTitle")}
                </h2>
                <p className="relative text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                  {t("helpSubtitle")}
                </p>
              </div>

              {/* Action rows */}
              <div className="px-6 pb-8 space-y-3">
                {HELP_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.titleKey}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: EASE }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-4 p-4 rounded-2xl",
                          "border border-neutral-200/80 dark:border-neutral-800",
                          "bg-neutral-50/50 dark:bg-white/[0.02]",
                          "hover:bg-neutral-50 dark:hover:bg-white/[0.04]",
                          "hover:border-neutral-300 dark:hover:border-neutral-700",
                          "transition-all duration-200",
                        )}
                      >
                        {/* Icon */}
                        <div className={cn(
                          "size-11 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 transition-all duration-200",
                          item.bgColor,
                          item.ringColor,
                          item.color,
                        )}>
                          <Icon className="size-5" />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-display font-bold leading-tight">
                            {t(item.titleKey)}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">
                            {t(item.descKey)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-medium text-muted-foreground hidden sm:block group-hover:text-foreground transition-colors">
                            {t(item.ctaKey)}
                          </span>
                          <div className="size-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200">
                            <IconArrowRight className="size-4 rtl:rotate-180" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
