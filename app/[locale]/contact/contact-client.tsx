"use client";

import { useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
  IconSend,
  IconSparkles,
} from "@tabler/icons-react";
import { rtlLocales, Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function ContactClient() {
  const t = useTranslations("contact");
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    employees: "",
  });

  const employeeOptions = [
    { value: "1-10", label: t("emp1_10") },
    { value: "11-50", label: t("emp11_50") },
    { value: "51-200", label: t("emp51_200") },
    { value: "201-500", label: t("emp201_500") },
    { value: "500+", label: t("emp500plus") },
  ];

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Contact Info Component
  const ContactInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("flex-1", isRTL && "text-right")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={cn("mb-8", isRTL && "flex justify-end")}>
        <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20", isRTL && "flex-row-reverse")}>
          <IconSparkles className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {t("badge")}
          </span>
        </div>
      </div>

      <Heading as="h1" className={cn("mb-6", isRTL && "text-right")}>
        {t("title")}
      </Heading>

      <Subheading className={cn("mb-12 max-w-md", isRTL && "text-right")}>
        {t("subtitle")}
      </Subheading>

      {/* Contact Details */}
      <div className="space-y-6 mb-12">
        {/* Email */}
        <motion.a
          href="mailto:hello@corteksa.com"
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-4 group"
        >
          <div className="size-12 shrink-0 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <IconMail className="size-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
          </div>
          <div className={cn(isRTL && "text-right")}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("emailUs")}
            </p>
            <p className="font-medium text-neutral-900 dark:text-white group-hover:text-primary transition-colors" dir="ltr">
              hello@corteksa.com
            </p>
          </div>
        </motion.a>

        {/* Phone */}
        <motion.a
          href="tel:+15551234567"
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 group"
        >
          <div className="size-12 shrink-0 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <IconPhone className="size-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
          </div>
          <div className={cn(isRTL && "text-right")}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("callUs")}
            </p>
            <p className="font-medium text-neutral-900 dark:text-white group-hover:text-primary transition-colors" dir="ltr">
              +1 (555) 123-4567
            </p>
          </div>
        </motion.a>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="size-12 shrink-0 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <IconMapPin className="size-5 text-neutral-600 dark:text-neutral-400" />
          </div>
          <div className={cn(isRTL && "text-right")}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t("location")}
            </p>
            <p className="font-medium text-neutral-900 dark:text-white">
              San Francisco, CA
            </p>
          </div>
        </motion.div>
      </div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={cn(isRTL && "flex flex-col items-end")}
      >
        <p className={cn("text-sm text-neutral-500 dark:text-neutral-400 mb-4", isRTL && "text-right")}>
          {t("followUs")}
        </p>
        <div className={cn("flex gap-3", isRTL && "justify-end")}>
          {[
            { icon: IconBrandTwitter, href: "#" },
            { icon: IconBrandLinkedin, href: "#" },
            { icon: IconBrandGithub, href: "#" },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <social.icon className="size-5" />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // Form Component
  const ContactForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex-1"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10"
      >
        {/* Decorative corner */}
        <div
          className={cn(
            "absolute top-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent",
            isRTL ? "left-0 rounded-tl-3xl" : "right-0 rounded-tr-3xl"
          )}
        />

        <h2 className={cn("text-2xl font-bold font-display mb-2", isRTL && "text-right")}>
          {t("formTitle")}
        </h2>
        <p className={cn("text-neutral-500 dark:text-neutral-400 mb-8", isRTL && "text-right")}>
          {t("formSubtitle")}
        </p>

        <div className="space-y-6">
          {/* Work Email */}
          <div>
            <Label htmlFor="email" className={cn("mb-2 block text-sm", isRTL && "text-right")}>
              {t("workEmail")} <span className="text-primary">{t("required")}</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              dir="ltr"
              className={isRTL ? "text-left" : ""}
            />
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className={cn("mb-2 block text-sm", isRTL && "text-right")}>
                {t("firstName")} <span className="text-primary">{t("required")}</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>
            <div>
              <Label htmlFor="lastName" className={cn("mb-2 block text-sm", isRTL && "text-right")}>
                {t("lastName")} <span className="text-primary">{t("required")}</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={isRTL ? "text-right" : ""}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className={cn("mb-2 block text-sm", isRTL && "text-right")}>
              {t("phone")} <span className="text-primary">{t("required")}</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              dir="ltr"
              className={isRTL ? "text-left" : ""}
            />
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company" className={cn("mb-2 block text-sm", isRTL && "text-right")}>
              {t("company")} <span className="text-primary">{t("required")}</span>
            </Label>
            <Input
              id="company"
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>

          {/* Number of Employees */}
          <div>
            <Label htmlFor="employees" className={cn("mb-2 block text-sm", isRTL && "text-right")}>
              {t("employees")} <span className="text-primary">{t("required")}</span>
            </Label>
            <Select
              value={formData.employees}
              onValueChange={(value) => handleChange("employees", value)}
            >
              <SelectTrigger className={isRTL ? "text-right" : ""}>
                <SelectValue placeholder={t("selectSize")} />
              </SelectTrigger>
              <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                {employeeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={isRTL ? "text-right" : ""}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full mt-2">
            {isRTL ? (
              <>
                {t("sendMessage")}
                <IconSend className="size-4 ml-2 rotate-180" />
              </>
            ) : (
              <>
                <IconSend className="size-4 mr-2" />
                {t("sendMessage")}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div
        className="absolute top-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2"
        style={{ left: isRTL ? "auto" : "25%", right: isRTL ? "25%" : "auto" }}
      />
      <div
        className="absolute bottom-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2"
        style={{ left: isRTL ? "25%" : "auto", right: isRTL ? "auto" : "25%" }}
      />

      {/* Main Section */}
      <section className="relative pt-10 md:pt-20 lg:pt-32 pb-20">
        <Container>
          <div
            className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* In RTL: Form on LEFT (second), Info on RIGHT (first) */}
            <ContactInfo />
            <ContactForm />
          </div>
        </Container>
      </section>

      {/* Bottom Section */}
      <section className="relative py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="mailto:sales@corteksa.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className={cn("group bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors", isRTL && "text-right")}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <IconMail
                className={cn("size-8 text-primary mb-4", isRTL ? "mr-auto ml-0" : "ml-auto mr-0")}
                style={{ display: "block" }}
              />
              <h3 className="font-bold text-lg mb-1">{t("sales")}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
                {t("salesDesc")}
              </p>
              <span className="text-primary font-medium text-sm group-hover:underline" dir="ltr">
                sales@corteksa.com
              </span>
            </motion.a>

            <motion.a
              href="mailto:support@corteksa.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className={cn("group bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors", isRTL && "text-right")}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <IconPhone
                className={cn("size-8 text-primary mb-4", isRTL ? "mr-auto ml-0" : "ml-auto mr-0")}
                style={{ display: "block" }}
              />
              <h3 className="font-bold text-lg mb-1">{t("support")}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
                {t("supportDesc")}
              </p>
              <span className="text-primary font-medium text-sm group-hover:underline" dir="ltr">
                support@corteksa.com
              </span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className={cn("bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6", isRTL && "text-right")}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <IconMapPin
                className={cn("size-8 text-primary mb-4", isRTL ? "mr-auto ml-0" : "ml-auto mr-0")}
                style={{ display: "block" }}
              />
              <h3 className="font-bold text-lg mb-1">{t("office")}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
                {t("officeDesc")}
              </p>
              <span className="text-neutral-900 dark:text-white font-medium text-sm">
                123 Market St, San Francisco
              </span>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
