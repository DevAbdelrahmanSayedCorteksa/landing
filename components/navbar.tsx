"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { Container } from "./container";
import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { IconLayoutSidebar, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileDropdown } from "./user-profile-dropdown";
import { MobileUserMenu } from "./mobile-user-menu";
import { LanguageSwitcher } from "./language-switcher";

export const Navbar = () => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800" dir="ltr">
      <DesktopNavbar />
      <MobileNavbar />
    </div>
  );
};

export const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const navlinks = [
    { title: t("product"), href: "/product" },
    { title: t("about"), href: "/about" },
    { title: t("blog"), href: "/blog" },
    { title: t("pricing"), href: "/pricing" },
    { title: t("contact"), href: "/contact" },
    { title: t("requestForm"), href: "/form" },
  ];

  return (
    <div className="flex md:hidden px-4 py-2 justify-between relative">
      <Logo />
      <button onClick={() => setOpen(!open)}>
        <IconLayoutSidebar className="size-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(15px)",
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed inset-0 h-full w-full z-50 px-4 py-1.5 flex flex-col justify-between bg-background/95"
            dir="ltr"
          >
            <div>
              <div className="flex justify-between">
                <Logo />
                <button onClick={() => setOpen(false)}>
                  <IconX />
                </button>
              </div>

              <div className="flex flex-col gap-6 my-10">
                {navlinks.map((item, index) => (
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -4,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.1,
                    }}
                    key={index + item.title}
                  >
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-2xl text-neutral-600 dark:text-neutral-400 font-medium"
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="pb-4 space-y-4">
              <LanguageSwitcher />
              {isLoading ? (
                <div className="h-24 bg-muted animate-pulse rounded-lg" />
              ) : isAuthenticated && user ? (
                <MobileUserMenu user={user} onLogout={logout} />
              ) : (
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href="/login"
                    className="text-sm px-4 inline-block py-2 rounded-md text-neutral-600 dark:text-neutral-400 font-medium"
                  >
                    {tCommon("login")}
                  </Link>
                  <Button asChild>
                    <Link href="/signup">{tCommon("signup")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DesktopNavbar = () => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  const navlinks = [
    { title: t("product"), href: "/product" },
    { title: t("about"), href: "/about" },
    { title: t("blog"), href: "/blog" },
    { title: t("pricing"), href: "/pricing" },
    { title: t("contact"), href: "/contact" },
    { title: t("requestForm"), href: "/form" },
  ];

  return (
    <Container className="py-4 items-center justify-between hidden lg:flex">
      <Logo />
      <div className="flex items-center gap-10">
        {navlinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-sm text-neutral-600 dark:text-neutral-400 font-medium"
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {isLoading ? (
          <div className="h-9 w-40 bg-muted animate-pulse rounded-md" />
        ) : isAuthenticated && user ? (
          <UserProfileDropdown user={user} onLogout={logout} />
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm px-4 inline-block py-2 rounded-md text-neutral-600 dark:text-neutral-400 font-medium"
            >
              {tCommon("login")}
            </Link>
            <Button asChild>
              <Link href="/signup">{tCommon("signup")}</Link>
            </Button>
          </>
        )}
      </div>
    </Container>
  );
};
