"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { UserChatIcon } from "@/illustrations/general";
import { Heading } from "./heading";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const FAQs = () => {
  const t = useTranslations("faqs");

  const questions = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
    { question: t("q5"), answer: t("a5") },
  ];

  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        <UserChatIcon />
        <Heading className="my-10 md:my-20">{t("title")}</Heading>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <Question
              key={index}
              question={question.question}
              answer={question.answer}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

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
      className="w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-4 md:p-8"
    >
      <div className="flex items-center justify-between ">
        <h3 className="text-lg md:text-2xl font-bold font-display text-start">
          {question}
        </h3>
        <div className="size-6 rounded-full relative bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
          <IconMinus
            className={cn(
              "size-6 text-white dark:text-black absolute inset-0 transition-all duration-200",
              open && "scale-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-6 text-white dark:text-black absolute inset-0 scale-0 -rotate-90 transition-all duration-200",
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
        exit={{
          height: 0,
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="overflow-hidden"
      >
        <motion.p
          key={String(open)}
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.2,
          }}
          className="text-start mt-4 text-neutral-600 dark:text-neutral-200"
        >
          {answer}
        </motion.p>
      </motion.div>
    </button>
  );
};
