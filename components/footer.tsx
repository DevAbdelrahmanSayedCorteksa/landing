"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { Container } from "./container";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import { Link } from "@/i18n/routing";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconSend,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

export const Footer = () => {
  const t = useTranslations("footer");

  const product = [
    { title: t("agentSimulator"), href: "/product" },
    { title: t("aiWorkflows"), href: "/product" },
    { title: t("agentBuilder"), href: "/product" },
    { title: t("analyticsDashboard"), href: "/product" },
    { title: t("apiIntegration"), href: "/product" },
    { title: t("enterpriseSolutions"), href: "/product" },
  ];

  const company = [
    { title: t("aboutUs"), href: "/about" },
    { title: t("contact"), href: "/contact" },
    { title: t("blog"), href: "/blog" },
    { title: t("pricing"), href: "/pricing" },
  ];

  return (
    <footer className="border-t perspective-distant overflow-hidden border-neutral-200 dark:border-neutral-800 py-10 md:py-20 lg:py-32 relative">
      <Container className="grid grid-cols-1 lg:grid-cols-5 gap-10 relative z-20">
        <div className="lg:col-span-2 flex flex-col gap-4 items-start">
          <Logo />
          <Subheading>{t("tagline")}</Subheading>
          <Button className="shadow-brand">{t("startTrial")}</Button>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-400">
            {t("product")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            {product.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="text-neutral-600 text-sm hover:text-black dark:text-neutral-400 dark:hover:text-white transition duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-400">
            {t("company")}
          </h4>
          <ul className="list-none flex flex-col gap-2">
            {company.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="text-neutral-600 text-sm hover:text-black dark:text-neutral-400 dark:hover:text-white transition duration-200"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-medium text-neutral-400">
            {t("newsletter")}
          </h4>
          <div className="border relative border-neutral-200 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 rounded-md">
            <input
              className="bg-transparent outline-none py-2 pl-2 pr-12 placeholder-neutral-400 text-neutral-600 text-sm"
              type="email"
              placeholder={t("emailPlaceholder")}
            />
            <button className="cursor-pointer px-4 py-2 rounded-[7px] bg-black inset-y-0 right-0 absolute">
              <IconSend className="text-white size-4" />
            </button>
          </div>
          <Subheading className="text-sm md:text-sm lg:text-sm">
            {t("newsletterSubtitle")}
          </Subheading>
        </div>
      </Container>

      <Container className="flex flex-col sm:flex-row justify-between mt-10 relative z-20 gap-4 md:gap-0">
        <p className="text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} {t("copyright")}
        </p>

        <div className="flex md:items-end items-start flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 *:text-sm *:text-neutral-500">
              <Link href="/privacy">{t("privacyPolicy")}</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/">
              <IconBrandTwitter className="size-4" />
            </Link>
            <Link href="/">
              <IconBrandInstagram className="size-4" />
            </Link>
            <Link href="/">
              <IconBrandLinkedin className="size-4" />
            </Link>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "flex items-center justify-center gap-20 h-[200%]",
          "absolute -inset-x-[150%] -inset-y-40",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,var(--color-neutral-100)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-100)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,var(--color-neutral-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-900)_1px,transparent_1px)]",
          "mask-radial-from-50%"
        )}
        style={{
          transform: " rotateX(60deg) ",
        }}
      />
    </footer>
  );
};
