"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

const comingSoonFeatures = [
  {
    key: "marketplace",
    src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop&q=80",
  },
  {
    key: "analytics",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&q=80",
  },
  {
    key: "mobileApp",
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop&q=80",
  },
  {
    key: "automation",
    src: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=600&fit=crop&q=80",
  },
  {
    key: "timeTracking",
    src: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&h=600&fit=crop&q=80",
  },
  {
    key: "apiIntegrations",
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=600&fit=crop&q=80",
  },
];

export function FeaturesComingSoon() {
  const t = useTranslations("product");

  const cards = comingSoonFeatures.map((feature, index) => (
    <Card
      key={feature.key}
      index={index}
      layout
      card={{
        src: feature.src,
        category: t("comingSoon"),
        title: t(
          `coming${feature.key.charAt(0).toUpperCase() + feature.key.slice(1)}Title`
        ),
        content: (
          <CardContent
            description={t(
              `coming${feature.key.charAt(0).toUpperCase() + feature.key.slice(1)}Desc`
            )}
          />
        ),
      }}
    />
  ));

  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="text-center mb-2 max-w-3xl mx-auto">
          <Heading className="mb-4">{t("comingSoonTitle")}</Heading>
          <Subheading className="mx-auto text-center">
            {t("comingSoonSubtitle")}
          </Subheading>
        </div>
      </Container>
      <Carousel items={cards} />
    </section>
  );
}

function CardContent({ description }: { description: string }) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-800 p-6 md:p-8 rounded-xl">
      <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}
