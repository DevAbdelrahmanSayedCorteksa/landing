"use client";
import React, { useRef, useState } from "react";
import { Container } from "./container";
import { UserChatIcon } from "@/illustrations/general";
import { Heading } from "./heading";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const FAQs = () => {
  const questions = [
    {
      question: "What is Corteksa?",
      answer:
        "Corteksa is a flexible workspace to manage projects, clients, and documents in one place. It's designed to be simple yet powerful, adapting to how you work.",
    },
    {
      question: "Who is Corteksa built for?",
      answer:
        "Corteksa is built for businesses that need simplicity without sacrificing flexibility. Whether you're a small team or a growing company, Corteksa fits your workflow.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes! Corteksa offers a free forever plan to get you started. You can upgrade anytime as your needs grow.",
    },
    {
      question: "What languages are supported?",
      answer:
        "Corteksa supports both Arabic and English interfaces. You can seamlessly switch between languages to work in the one that feels most natural.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "We provide unlimited support because we see ourselves as your partner, not just a tool. Every step you take, we're here to help.",
    },
  ];
  return (
    <section className="py-10 md:py-20 lg:py-32 relative overflow-hidden">
      <Container>
        <UserChatIcon />
        <Heading className="my-10 md:my-20">Frequently Asked Questions</Heading>

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
        <h3 className="text-lg md:text-2xl font-bold font-display">
          {question}
        </h3>
        <div className="size-6 rounded-full relative bg-black dark:bg-white flex items-center justify-center">
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
          className="text-left mt-4 text-neutral-600 dark:text-neutral-200"
        >
          {answer}
        </motion.p>
      </motion.div>
    </button>
  );
};
