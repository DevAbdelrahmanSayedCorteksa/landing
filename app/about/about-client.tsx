"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { LandingImages } from "@/components/landing-images";
import { GradientDivider } from "@/components/gradient-divider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconRocket,
  IconHeart,
  IconEye,
  IconPlus,
  IconMinus,
  IconBriefcase,
} from "@tabler/icons-react";

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CEO",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-pink-100",
  },
  {
    id: 2,
    name: "James Wilson",
    role: "CTO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-blue-100",
  },
  {
    id: 3,
    name: "Emily Zhang",
    role: "Head of Design",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-purple-100",
  },
  {
    id: 4,
    name: "Michael Torres",
    role: "Lead Engineer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-green-100",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Product Manager",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-yellow-100",
  },
  {
    id: 6,
    name: "David Kim",
    role: "Marketing Lead",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    bgColor: "bg-pink-100",
  },
];

// Logo cloud data
const logos = [
  { title: "OpenAI", src: "https://assets.aceternity.com/logos/openai.png" },
  {
    title: "Hello Patient",
    src: "https://assets.aceternity.com/logos/hello-patient.png",
  },
  { title: "Granola", src: "https://assets.aceternity.com/logos/granola.png" },
  {
    title: "Character AI",
    src: "https://assets.aceternity.com/logos/characterai.png",
  },
  { title: "Oracle", src: "https://assets.aceternity.com/logos/oracle.png" },
  { title: "Portola", src: "https://assets.aceternity.com/logos/portola.png" },
];

// Stats data
const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50+", label: "Countries" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" },
];

// Values data
const values = [
  {
    icon: IconRocket,
    title: "Innovation First",
    description:
      "We push boundaries and embrace new ideas to deliver cutting-edge solutions.",
  },
  {
    icon: IconHeart,
    title: "Customer Obsessed",
    description:
      "Your success is our success. We go above and beyond to exceed expectations.",
  },
  {
    icon: IconEye,
    title: "Radical Transparency",
    description:
      "Open communication builds trust. We share openly and honestly.",
  },
];

// FAQ data
const faqs = [
  {
    question: "What makes Corteksa different?",
    answer:
      "Corteksa combines AI-powered automation with intuitive design, making it the only CRM that truly adapts to how your team works. Our platform learns from your workflows and suggests optimizations automatically.",
  },
  {
    question: "Where is Corteksa based?",
    answer:
      "We're a fully remote company with team members across North America, Europe, and Asia. Our headquarters is in San Francisco, with satellite offices in London and Singapore.",
  },
  {
    question: "Are you hiring?",
    answer:
      "Yes! We're always looking for talented individuals who share our passion for building great products. Check out our careers page for current openings in engineering, design, and sales.",
  },
  {
    question: "How can I partner with Corteksa?",
    answer:
      "We love working with partners who share our vision. Whether you're an agency, consultant, or technology company, reach out to partnerships@corteksa.com to explore collaboration opportunities.",
  },
];

// Question component for FAQ
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
      className="w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 p-4 md:p-8 text-left"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-2xl font-bold font-display">
          {question}
        </h3>
        <div className="size-6 rounded-full relative bg-black dark:bg-white flex items-center justify-center shrink-0 ml-4">
          <IconMinus
            className={cn(
              "size-4 text-white dark:text-black absolute inset-0 m-auto transition-all duration-200",
              open && "scale-0 rotate-90"
            )}
          />
          <IconPlus
            className={cn(
              "size-4 text-white dark:text-black absolute inset-0 m-auto scale-0 -rotate-90 transition-all duration-200",
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
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">{answer}</p>
      </motion.div>
    </button>
  );
};

export function AboutClient() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-10 md:pt-20 lg:pt-32 pb-10 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Text Content */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-bold uppercase tracking-widest text-primary mb-6"
              >
                About Corteksa
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Heading as="h1" className="mb-6">
                  We&apos;re building the future of work
                </Heading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Subheading className="mb-8 max-w-lg">
                  Corteksa brings teams, tasks, and tools together in one
                  powerful AI-driven platform. We&apos;re on a mission to make
                  work more productive and enjoyable for everyone.
                </Subheading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg">Our Story</Button>
                <Button size="lg" variant="outline">
                  <IconBriefcase className="size-5 mr-2" />
                  Join the Team
                </Button>
              </motion.div>
            </div>

            {/* Right: Landing Images */}
            <div className="hidden lg:block">
              <LandingImages
                firstImageSrc="https://assets.aceternity.com/screenshots/4.jpg"
                secondImageSrc="https://assets.aceternity.com/screenshots/3.jpg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Logo Cloud Section */}
      <section className="py-10 md:py-16 border-y border-neutral-200 dark:border-neutral-800">
        <Container>
          <h2 className="text-neutral-600 font-medium dark:text-neutral-400 text-lg text-center max-w-xl mx-auto mb-10">
            Trusted by modern operators across industries.
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.title}
                initial={{ y: -10, opacity: 0, filter: "blur(10px)" }}
                whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <Image
                  src={logo.src}
                  width={80}
                  height={80}
                  alt={logo.title}
                  className="object-contain dark:filter dark:invert opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
                Our Story
              </p>
              <Heading className="mb-6">
                From a simple idea to a global platform
              </Heading>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-300">
                <p>
                  Corteksa started in 2020 with a simple observation: teams were
                  spending more time managing their tools than doing actual
                  work. We knew there had to be a better way.
                </p>
                <p>
                  Our founders, veterans of the enterprise software industry,
                  set out to build a platform that would truly understand how
                  teams work. Using the latest advances in AI, we created a
                  system that learns and adapts.
                </p>
                <p>
                  Today, Corteksa serves thousands of teams worldwide, from
                  startups to Fortune 500 companies. But we&apos;re just getting
                  started.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <LandingImages
                firstImageSrc="https://assets.aceternity.com/screenshots/1.jpg"
                secondImageSrc="https://assets.aceternity.com/screenshots/2.jpg"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      <GradientDivider />

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary mb-4"
            >
              Our Values
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Heading className="mb-4">What We Stand For</Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Subheading className="mx-auto">
                Our core values guide everything we do
              </Subheading>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-3xl p-8"
              >
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-neutral-900 dark:text-neutral-100 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-widest text-primary mb-4"
            >
              Our Team
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Heading className="mb-4">Meet the People Behind Corteksa</Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Subheading className="mx-auto">
                A passionate team dedicated to transforming how teams work
              </Subheading>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "relative overflow-hidden rounded-2xl",
                  member.bgColor
                )}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white font-bold text-sm">{member.name}</p>
                  <p className="text-white/80 text-xs">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-neutral-50 dark:bg-neutral-900">
        <Container>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Heading className="mb-4">Common Questions</Heading>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Question question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-neutral-900 dark:bg-neutral-800">
        <Container>
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Heading className="text-white mb-6">
                Ready to transform your workflow?
              </Heading>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-neutral-400 max-w-2xl mx-auto mb-8"
            >
              Join thousands of teams already using Corteksa to streamline their
              operations and boost productivity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg">Start Free Trial</Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-600 text-white hover:bg-neutral-800"
              >
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
