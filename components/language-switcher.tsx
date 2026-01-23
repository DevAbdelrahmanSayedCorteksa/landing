"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { locales, localeNames, Locale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLanguage } from "@tabler/icons-react";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const fullPathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Remove current locale prefix from pathname
  const localePattern = new RegExp(`^/(${locales.join("|")})`);
  const pathname = fullPathname.replace(localePattern, "") || "/";

  function onSelectChange(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as Locale });
    });
  }

  return (
    <Select value={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger className="w-9 h-9 p-0 justify-center cursor-pointer [&>svg:last-child]:hidden">
        <IconLanguage className="size-4" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
