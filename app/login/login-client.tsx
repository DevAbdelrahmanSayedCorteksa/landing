"use client";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { LoginForm } from "@/components/login-form";
import { LandingImages } from "@/components/landing-images";
import { Logo } from "@/components/logo";
import { PageTransition } from "@/components/page-transition";

export function LoginClient() {
  return (
    <PageTransition>
      <main className="min-h-screen grid lg:grid-cols-2 bg-background relative">
        {/* Logo - Top Left */}
        <div className="absolute top-6 left-6 z-50">
          <Logo />
        </div>
        {/* Left Section - Form */}
        <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 lg:border-r border-border">
          <div className="w-full max-w-md space-y-8">
            {/* Heading */}
            <div className="text-center">
              <Heading as="h1" className="text-2xl md:text-3xl lg:text-4xl mb-2">
                Welcome back
              </Heading>
              <Subheading className="text-base">
                Sign in to your account to continue
              </Subheading>
            </div>

            {/* Form - No Card Wrapper */}
            <LoginForm />
          </div>
        </div>

        {/* Right Section - Images */}
        <section className="hidden lg:flex flex-col justify-start pt-8 md:pt-12 lg:pt-16 relative overflow-hidden min-h-screen">
          <div className="w-full px-8 md:px-12 lg:px-16 mb-16">
            {/* Title and Description */}
            <div className="text-left max-w-2xl">
              <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl mb-3">
                The Brain behind your business
              </Heading>
              <Subheading className="text-base">
                Empower your team with AI agents that understand context, make
                decisions, and execute tasks seamlessly.
              </Subheading>
            </div>
          </div>

          <div className="w-full">
            <LandingImages />
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
