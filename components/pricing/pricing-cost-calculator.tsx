"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { AnimatedPrice } from "@/components/ui/animated-price";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { rtlLocales, Locale } from "@/i18n/routing";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconArrowRight,
  IconCalculator,
} from "@tabler/icons-react";
import {
  EASE,
  COMPETITOR_APPS,
  DEFAULT_SELECTED,
  CORTEKSA_PRICE_PER_USER_MONTH,
} from "./pricing-data";

export function PricingCostCalculator() {
  const t = useTranslations("pricingPage");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(() => new Set(DEFAULT_SELECTED));
  const [teamSize, setTeamSize] = useState(1);

  const toggleApp = (id: string) => {
    setSelectedApps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedList = useMemo(
    () => COMPETITOR_APPS.filter(app => selectedApps.has(app.id)),
    [selectedApps]
  );

  const competitorMonthly = useMemo(
    () => selectedList.reduce((sum, app) => sum + app.price, 0),
    [selectedList]
  );

  const competitorAnnual = competitorMonthly * teamSize * 12;
  const corteksaAnnual = CORTEKSA_PRICE_PER_USER_MONTH * teamSize * 12;
  const savings = Math.max(0, competitorAnnual - corteksaAnnual);

  const handleTeamSize = (val: number) => setTeamSize(Math.min(10000, Math.max(1, val)));
  const step = teamSize < 10 ? 1 : teamSize < 100 ? 10 : 50;

  const formatCurrency = (amount: number) => `$${amount.toLocaleString("en-US")}`;

  return (
    <section className={cn(
      "py-12 md:py-16 lg:py-20",
      "bg-neutral-50/50 dark:bg-neutral-900/30",
    )}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Container>
          {/* Badge */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              <IconCalculator className="size-4" />
              {t("costCalcTitle")}
            </span>
          </div>

          <div className="text-center mb-10 md:mb-14">
            <Heading className="mb-4">{t("costCalcTitle")}</Heading>
            <Subheading className="mx-auto">{t("costCalcSubtitle")}</Subheading>
          </div>

          {/* Gradient border wrapper with shadow */}
          <div className="rounded-3xl p-[2px] bg-gradient-to-br from-primary via-purple-400 to-blue-500 shadow-xl shadow-primary/5">
            <div className="rounded-[calc(1.5rem-2px)] bg-white dark:bg-neutral-950 overflow-hidden">
              <div className={cn(
                "grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]",
                isRTL && "lg:direction-rtl"
              )}>
                {/* LEFT — App Selection */}
                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-display font-bold">
                      {t("costCalcWhichApps")}
                    </h3>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary tabular-nums">
                      {selectedApps.size}/{COMPETITOR_APPS.length}
                    </span>
                  </div>

                  {/* App grid — tiles */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {COMPETITOR_APPS.map((app, index) => {
                      const isSelected = selectedApps.has(app.id);
                      return (
                        <motion.button
                          key={app.id}
                          onClick={() => toggleApp(app.id)}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02, ease: EASE }}
                          viewport={{ once: true }}
                          className={cn(
                            "group relative flex flex-col items-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all duration-200",
                            isSelected
                              ? "border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10"
                              : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary/30 hover:shadow-sm"
                          )}
                        >
                          {/* Checkmark badge */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1.5 -end-1.5 size-5 rounded-full bg-primary text-white flex items-center justify-center shadow-sm"
                            >
                              <IconCheck className="size-3" />
                            </motion.div>
                          )}
                          {/* Icon */}
                          <div className={cn(
                            "size-10 rounded-xl flex items-center justify-center transition-colors",
                            isSelected
                              ? "bg-primary/10"
                              : "bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-700"
                          )}>
                            <Image
                              src={app.icon}
                              alt={app.name}
                              width={28}
                              height={28}
                              className="size-7 object-contain"
                            />
                          </div>
                          {/* Name */}
                          <span className={cn(
                            "text-[11px] leading-tight text-center w-full truncate transition-colors",
                            isSelected ? "text-primary font-semibold" : "text-muted-foreground"
                          )}>
                            {app.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Team size — card style */}
                  <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 p-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <label className="text-sm font-display font-bold block">
                          {t("costCalcTeamSize")}
                        </label>
                        <span className="text-xs text-muted-foreground">{t("costCalcUsers")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleTeamSize(teamSize - step)}
                          disabled={teamSize <= 1}
                          className="rounded-xl size-9"
                        >
                          <IconMinus className="size-4" />
                        </Button>
                        <input
                          type="number"
                          value={teamSize}
                          onChange={e => handleTeamSize(parseInt(e.target.value) || 1)}
                          className="w-20 h-9 text-center text-base font-display font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min={1}
                          max={10000}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleTeamSize(teamSize + step)}
                          disabled={teamSize >= 10000}
                          className="rounded-xl size-9"
                        >
                          <IconPlus className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Cost Summary */}
                <div className={cn(
                  "border-t lg:border-t-0 lg:border-s border-neutral-200 dark:border-neutral-800",
                  "bg-gradient-to-b from-neutral-50 to-neutral-100/50 dark:from-neutral-900/80 dark:to-neutral-900/40",
                  "p-6 md:p-8 lg:p-10 flex flex-col"
                )}>
                  <div className="mb-3">
                    <h3 className="text-lg font-display font-bold">
                      {t("costCalcAppsToReplace")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("costCalcForUsers", { users: teamSize.toLocaleString() })}
                    </p>
                  </div>

                  {/* Selected apps list */}
                  <div className="flex-1 min-h-0 max-h-60 overflow-y-auto overflow-x-hidden my-3 pe-1 [scrollbar-width:thin] [scrollbar-color:var(--color-neutral-300)_transparent] dark:[scrollbar-color:var(--color-neutral-700)_transparent]">
                    <AnimatePresence initial={false}>
                      {selectedList.map(app => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                            <Image
                              src={app.icon}
                              alt={app.name}
                              width={20}
                              height={20}
                              className="size-5 object-contain flex-shrink-0"
                            />
                            <span className="text-sm flex-1 truncate">{app.name}</span>
                            <span className="text-sm font-medium text-muted-foreground tabular-nums">
                              ${app.price}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {selectedList.length === 0 && (
                      <p className="text-sm text-muted-foreground py-10 text-center">
                        {t("costCalcWhichApps")}
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3 mt-auto">
                    {/* Competitor total */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{t("costCalcTotal")}</span>
                      <span className="text-lg font-display font-bold text-red-500 dark:text-red-400">
                        <AnimatedPrice value={competitorAnnual} className="" />
                        <span className="text-xs font-normal text-muted-foreground ms-1">{t("costCalcYear")}</span>
                      </span>
                    </div>

                    {/* Corteksa total */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("costCalcCorteksaFor", { users: teamSize.toLocaleString() })}
                      </span>
                      <span className="text-base font-display font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(corteksaAnnual)}
                        <span className="text-xs font-normal text-muted-foreground ms-1">{t("costCalcYear")}</span>
                      </span>
                    </div>

                    {/* Savings highlight */}
                    {savings > 0 && (
                      <motion.div
                        key={savings}
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 dark:from-primary/15 dark:via-purple-500/15 dark:to-blue-500/15 border border-primary/20 p-5"
                      >
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-1 block">
                          {t("costCalcSave")}
                        </span>
                        <div className="text-3xl md:text-4xl font-display font-bold italic bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
                          {formatCurrency(savings)}{t("costCalcYear")}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t("costCalcSaveDescription", {
                            users: teamSize.toLocaleString(),
                            savings: formatCurrency(savings),
                          })}
                        </p>
                      </motion.div>
                    )}

                    <Button size="lg" className="w-full shadow-brand mt-2" asChild>
                      <Link href="/signup" className="gap-2">
                        {t("costCalcCta")}
                        <IconArrowRight className="size-4 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
