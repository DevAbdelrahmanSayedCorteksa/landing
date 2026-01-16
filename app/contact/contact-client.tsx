"use client";

import { useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
  IconSend,
  IconSparkles,
} from "@tabler/icons-react";

const employeeOptions = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

export function ContactClient() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    employees: "",
  });

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2" />

      {/* Main Section */}
      <section className="relative pt-10 md:pt-20 lg:pt-32 pb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            {/* Left Side - Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <IconSparkles className="size-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Get in touch
                </span>
              </div>

              <Heading as="h1" className="mb-6">
                Let&apos;s build something amazing together
              </Heading>

              <Subheading className="mb-12 max-w-md">
                Have a project in mind? We&apos;d love to hear about it. Drop us
                a line and we&apos;ll get back to you as soon as possible.
              </Subheading>

              {/* Contact Details */}
              <div className="space-y-6 mb-12">
                <motion.a
                  href="mailto:hello@corteksa.com"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <IconMail className="size-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Email us
                    </p>
                    <p className="font-medium text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                      hello@corteksa.com
                    </p>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+15551234567"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <IconPhone className="size-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Call us
                    </p>
                    <p className="font-medium text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </motion.a>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <IconMapPin className="size-5 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Location
                    </p>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      San Francisco, CA
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Follow us
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: IconBrandTwitter, href: "#" },
                    { icon: IconBrandLinkedin, href: "#" },
                    { icon: IconBrandGithub, href: "#" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                      <social.icon className="size-5" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form
                onSubmit={handleSubmit}
                className="relative bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-tr-3xl" />

                <h2 className="text-2xl font-bold font-display mb-2">
                  Send a message
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 mb-8">
                  Fill out the form below and we&apos;ll be in touch soon.
                </p>

                <div className="space-y-6">
                  {/* Work Email */}
                  <div>
                    <Label htmlFor="email" className="mb-2 block text-sm">
                      Work Email <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="mb-2 block text-sm">
                        First Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="mb-2 block text-sm">
                        Last Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="mb-2 block text-sm">
                      Phone <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <Label htmlFor="company" className="mb-2 block text-sm">
                      Company <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company"
                      required
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                    />
                  </div>

                  {/* Number of Employees */}
                  <div>
                    <Label htmlFor="employees" className="mb-2 block text-sm">
                      Number of Employees{" "}
                      <span className="text-primary">*</span>
                    </Label>
                    <Select
                      value={formData.employees}
                      onValueChange={(value) => handleChange("employees", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit */}
                  <Button type="submit" size="lg" className="w-full mt-2">
                    <IconSend className="size-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Bottom Section */}
      <section className="relative py-16 md:py-24 border-t border-neutral-200 dark:border-neutral-800">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="mailto:sales@corteksa.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="group bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <IconMail className="size-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-1">Sales</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
                Talk to our sales team
              </p>
              <span className="text-primary font-medium text-sm group-hover:underline">
                sales@corteksa.com
              </span>
            </motion.a>

            <motion.a
              href="mailto:support@corteksa.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <IconPhone className="size-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-1">Support</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
                Get help with your account
              </p>
              <span className="text-primary font-medium text-sm group-hover:underline">
                support@corteksa.com
              </span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-6"
            >
              <IconMapPin className="size-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-1">Office</h3>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-2">
                Visit our headquarters
              </p>
              <span className="text-neutral-900 dark:text-white font-medium text-sm">
                123 Market St, San Francisco
              </span>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
