"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { rtlLocales, Locale } from "@/i18n/routing";

export const LandingImages = ({
  firstImageSrc = "https://assets.aceternity.com/screenshots/4.jpg",
  secondImageSrc = "https://assets.aceternity.com/screenshots/3.jpg",
  showGradient = true,
}) => {
  const locale = useLocale() as Locale;
  const isRTL = rtlLocales.includes(locale);

  return (
    <div className="relative">
      <div
        className={cn(
          "relative min-h-72 sm:min-h-80 md:min-h-100 lg:min-h-140 w-full pt-20 perspective-distant",
          isRTL
            ? "-translate-x-10 md:-translate-x-28"
            : "translate-x-10 md:translate-x-28"
        )}
      >
        <motion.div
          initial={{
            opacity: 0,
            y: -100,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
          }}
          className="perspective-[4000px] shadow-2xl"
        >
          <Image
            src={firstImageSrc}
            alt="Demo screenshot"
            height={1080}
            width={1920}
            draggable={false}
            className={cn(
              "absolute inset-0 rounded-lg shadow-xl select-none pointer-events-none",
              isRTL
                ? "mask-l-from-20% mask-b-from-20%"
                : "mask-r-from-20% mask-b-from-20%"
            )}
            style={{
              transform: isRTL
                ? "rotateY(-20deg) rotateX(40deg) rotateZ(20deg)"
                : "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
            }}
          />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: -100,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.1,
          }}
          viewport={{
            once: true,
          }}
          className={cn(
            "perspective-[4000px] -translate-y-10 md:-translate-y-20 lg:-translate-y-40",
            isRTL ? "-translate-x-20" : "translate-x-20"
          )}
        >
          <Image
            src={secondImageSrc}
            alt="Demo screenshot"
            height={1080}
            width={1920}
            draggable={false}
            className={cn(
              "absolute inset-0 rounded-lg shadow-xl select-none pointer-events-none",
              isRTL
                ? "translate-x-10 mask-l-from-50% mask-b-from-50%"
                : "-translate-x-10 mask-r-from-50% mask-b-from-50%"
            )}
            style={{
              transform: isRTL
                ? "rotateY(-20deg) rotateX(40deg) rotateZ(20deg)"
                : "rotateY(20deg) rotateX(40deg) rotateZ(-20deg)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
