"use client";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { LandingImages } from "@/components/landing-images";
import { Logo } from "@/components/logo";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background relative">
      {/* Logo - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <Logo />
      </div>

      {/* Left Section - Form */}
      <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 lg:border-r border-border">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Heading as="h1" className="text-2xl md:text-3xl lg:text-4xl mb-2">
              Reset your password
            </Heading>
            <Subheading className="text-base">
              Enter your email and we'll send you a reset link
            </Subheading>
          </div>
          <ForgotPasswordForm />
        </div>
      </div>

      {/* Right Section - Images */}
      <section className="hidden lg:flex flex-col justify-start pt-8 md:pt-12 lg:pt-16 relative overflow-hidden min-h-screen">
        <div className="w-full px-8 md:px-12 lg:px-16 mb-16">
          <div className="text-left max-w-2xl">
            <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl mb-3">
              We've got you covered
            </Heading>
            <Subheading className="text-base">
              Secure password recovery to get you back to building amazing things with AI agents.
            </Subheading>
          </div>
        </div>
        <div className="w-full">
          <LandingImages />
        </div>
      </section>
    </main>
  );
}
