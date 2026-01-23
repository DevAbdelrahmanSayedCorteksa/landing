"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { LandingImages } from "@/components/landing-images";
import { GradientDivider } from "@/components/gradient-divider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { rtlLocales, Locale } from "@/i18n/routing";
import {
  IconRocket,
  IconHeart,
  IconEye,
  IconPlus,
  IconMinus,
  IconBriefcase,
} from "@tabler/icons-react";

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    roleKey: "roleCEO",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-pink-100",
  },
  {
    id: 2,
    name: "James Wilson",
    roleKey: "roleCTO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    name: "Emily Zhang",
    roleKey: "roleDesign",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-purple-100",
  },
  {
    id: 4,
    name: "Michael Torres",
    roleKey: "roleEngineer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-green-100",
  },
  {
    id: 5,
    name: "Priya Sharma",
    roleKey: "roleProduct",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-yellow-100",
  },
  {
    id: 6,
    name: "David Kim",
    roleKey: "roleMarketing",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-pink-100",
  },
];

// Logo cloud data
const logos = [
  { title: "OpenAI", src: "https://assets.aceternity.com/logos/openai.png" },
  {
    title: "Hello Patient",
    src: "https://assets.aceternity.com/logos/hello-patient.png",
  },
  { title: "Granola", src: "https://assets.aceternity.com/logos/granola.png" },
  {
    title: "Character AI",
    src: "https://assets.aceternity.com/logos/characterai.png",
  },
  { title: "Oracle", src: "https://assets.aceternity.com/logos/oracle.png" },
  { title: "Portola", src: "https://assets.aceternity.com/logos/portola.png" },
];

// Stats data with translation keys
const stats = [
  { number: "10K+", labelKey: "statUsers" },
  { number: "50+", labelKey: "statCountries" },
  { number: "99.9%", labelKey: "statUptime" },
  { number: "24/7", labelKey: "statSupport" },
];

// Values data with translation keys
const values = [
  {
    icon: IconRocket,
    titleKey: "valueInnovationTitle",
    descKey: "valueInnovationDesc",
  },
  {
    icon: IconHeart,
    titleKey: "valueCustomerTitle",
    descKey: "valueCustomerDesc",
  },
  {
    icon: IconEye,
    titleKey: "valueTransparencyTitle",
    descKey: "valueTransparencyDesc",
  },
];

// FAQ data with translation keys
const faqs = [
  { questionKey: "faq1Question", answerKey: "faq1Answer" },
  { questionKey: "faq2Question", answerKey: "faq2Answer" },
  { questionKey: "faq3Question", answerKey: "faq3Answer" },
  { questionKey: "faq4Question", answerKey: "faq4Answer" },
];

// Question component for FAQ
const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-4 md:p-8 text-start"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-2xl font-bold font-display">
          {question}
        </h3>
        <div className="size-6 rounded-full relative bg-black dark:bg-white flex items-center justify-center shrink-0 ms-4">
          <IconMinus
            className={cn(
              "size-4 text-white dark:text-black absolute inset-0 m-auto transition-all duration-200",
              open && "scale-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-4 text-white dark:text-black absolute inset-0 m-auto scale-0 -rotate-90 transition-all duration-200",
              open && "scale-100 rotate-0"
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
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">{answer}</p>
      </motion.div>
    </button>
  );
};

export function AboutClient() {
  const t = useTranslations("about");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-10 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-bold uppercase tracking-widest text-primary mb-6"
              >
                {t("badge")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Heading as="h1" className="mb-6">
                  {t("heroTitle")}
                </Heading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Subheading className="mb-8 max-w-lg">
                  {t("heroSubtitle")}
                </Subheading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg">{t("ourStoryBtn")}</Button>
                <Button size="lg" variant="outline">
                  <IconBriefcase className="size-5 me-2" />
                  {t("joinTeamBtn")}
                </Button>
              </motion.div>
            </div>

            {/* Landing Images */}
            <div className="hidden lg:block">
              <LandingImages
                firstImageSrc="https://assets.aceternity.com/screenshots/4.jpg"
                secondImageSrc="https://assets.aceternity.com/screenshots/3.jpg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Logo Cloud Section */}
      <section className="py-10 md:py-16 border-y border-neutral-200 dark:border-neutral-800">
        <Container>
          <h2 className={cn(
            "text-neutral-600 font-medium dark:text-neutral-400 text-lg text-center max-w-xl mx-auto mb-10"
          )}>
            {t("trustedBy")}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.title}
                initial={{ y: -10, opacity: 0, filter: "blur(10px)" }}
                whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <Image
                  src={logo.src}
                  width={80}
                  height={80}
                  alt={logo.title}
                  className="object-contain dark:filter dark:invert opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                {t("storyBadge")}
              </p>
              <Heading className="mb-6">
                {t("storyTitle")}
              </Heading>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
                <p>{t("storyP3")}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <LandingImages
                firstImageSrc="https://assets.aceternity.com/screenshots/1.jpg"
                secondImageSrc="https://assets.aceternity.com/screenshots/2.jpg"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <GradientDivider />

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary mb-4"
            >
              {t("valuesBadge")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Heading className="mb-4">{t("valuesTitle")}</Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Subheading className="mx-auto">
                {t("valuesSubtitle")}
              </Subheading>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-3xl p-8"
              >
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">
                  {t(value.titleKey)}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {t(value.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
                  {t(stat.labelKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary mb-4"
            >
              {t("teamBadge")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Heading className="mb-4">{t("teamTitle")}</Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Subheading className="mx-auto">
                {t("teamSubtitle")}
              </Subheading>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative overflow-hidden rounded-2xl",
                  member.bgColor
                )}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-bold text-sm">{member.name}</p>
                  <p className="text-white/80 text-xs">{t(member.roleKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Heading className="mb-4">{t("faqTitle")}</Heading>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Question
                  question={t(faq.questionKey)}
                  answer={t(faq.answerKey)}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-neutral-900 dark:bg-neutral-800">
        <Container>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Heading className="text-white mb-6">
                {t("ctaTitle")}
              </Heading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-neutral-400 max-w-2xl mx-auto mb-8"
            >
              {t("ctaSubtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg">{t("ctaStartTrial")}</Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-600 text-white hover:bg-neutral-800"
              >
                {t("ctaContactSales")}
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
