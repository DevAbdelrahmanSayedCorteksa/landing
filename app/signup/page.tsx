"use client";

import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { SignupForm } from "@/components/signup-form";
import { LandingImages } from "@/components/landing-images";
import { Logo } from "@/components/logo";

export default function SignupPage() {
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
              Create your account
            </Heading>
            <Subheading className="text-base">
              Join us and start building with AI agents
            </Subheading>
          </div>
          <SignupForm />
        </div>
      </div>

      {/* Right Section - Images */}
      <section className="hidden lg:flex flex-col justify-start pt-8 md:pt-12 lg:pt-16 relative overflow-hidden min-h-screen">
        <div className="w-full px-8 md:px-12 lg:px-16 mb-16">
          <div className="text-left max-w-2xl">
            <Heading as="h2" className="text-2xl md:text-3xl lg:text-4xl mb-3">
              Build faster with AI agents
            </Heading>
            <Subheading className="text-base">
              Transform your workflow with intelligent automation. Deploy custom agents in minutes, not hours.
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
