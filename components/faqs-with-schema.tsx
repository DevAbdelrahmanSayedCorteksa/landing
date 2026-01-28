import { getTranslations, getLocale } from "next-intl/server";
import { FAQSchema } from "@/components/seo";
import { FAQs } from "./faqs";
import { Locale } from "@/i18n/routing";

export async function FAQsWithSchema() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("faqs");

  // Get FAQ items for schema
  const faqItems = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
    { question: t("q5"), answer: t("a5") },
  ];

  return (
    <>
      {/* FAQ Schema for SEO */}
      <FAQSchema items={faqItems} locale={locale} />
      {/* FAQ Component */}
      <FAQs />
    </>
  );
}
