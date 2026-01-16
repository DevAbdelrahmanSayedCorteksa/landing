import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./ui/button";
import Link from "next/link";
import { LandingImages } from "./landing-images";
import { GradientDivider } from "./gradient-divider";

export const Hero = () => {
  return (
    <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
      <Container>
        <Heading as="h1">
          The brain behind <br /> your business
        </Heading>

        <Subheading className="py-8">
          Manage projects, clients, offers, and operations in one hub designed
          to fit the way you work.
        </Subheading>
        <div className="flex items-center gap-6">
          <Button className="shadow-brand">Get Started</Button>
          <Button asChild variant="outline">
            <Link href="/features">See all features</Link>
          </Button>
        </div>
        <LandingImages />
      </Container>
      <GradientDivider />
    </section>
  );
};
