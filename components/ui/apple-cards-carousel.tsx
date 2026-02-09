"use client";
import React, { useEffect } from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-6 [scrollbar-width:none] md:py-10"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div
          className={cn(
            "flex flex-row justify-start gap-4 pl-4",
            "mx-auto max-w-7xl",
          )}
        >
          {items.map((item, index) => (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.1 * index,
                  ease: "easeOut",
                },
              }}
              key={"card" + index}
              className="shrink-0 rounded-2xl last:pr-[5%] md:last:pr-[33%]"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl justify-end gap-2 px-4">
        <button
          className="relative z-40 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <IconArrowNarrowLeft className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </button>
        <button
          className="relative z-40 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50"
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <IconArrowNarrowRight className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>
    </div>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  return (
    <div
      className="group/card relative h-72 w-48 overflow-hidden rounded-2xl transition-[width] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] md:h-80 md:w-60 hover:w-[28rem] md:hover:w-[38rem]"
    >
      {/* Primary background — always present, behind everything */}
      <div className="absolute inset-0 bg-primary" />

      {/* Image — fixed size, never changes */}
      <div className="absolute inset-y-0 left-0 z-10 w-48 shrink-0 md:w-60">
        <img
          src={card.src}
          alt={card.title}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* Bottom gradient for title readability */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-200 group-hover/card:opacity-0" />
      </div>

      {/* Title over image — fades out on hover */}
      <p className="pointer-events-none absolute bottom-0 left-0 z-20 w-48 p-3 text-center text-sm font-semibold text-white transition-opacity duration-200 md:w-60 md:text-base group-hover/card:opacity-0">
        {card.title}
      </p>

      {/* Content — FIXED width so text never reflows. Card overflow-hidden reveals it like a curtain */}
      <div className="pointer-events-none absolute inset-y-0 left-48 z-10 flex w-[16rem] flex-col justify-center p-5 md:left-60 md:w-[23rem] md:p-8">
        <span className="mb-2 inline-block w-fit rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white/90 uppercase">
          {card.category}
        </span>
        <h3 className="text-base font-bold text-white md:text-lg">
          {card.title}
        </h3>
        <div className="mt-3 text-[13px] leading-relaxed text-white/80 md:text-sm">
          {card.content}
        </div>
      </div>
    </div>
  );
};

