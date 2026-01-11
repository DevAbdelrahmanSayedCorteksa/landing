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
          Agents that do the work <br /> Approvals that keep you safe.
        </Heading>

        <Subheading className="py-8">
          Deploy AI agents that plan, act through your tools, and report
          outcomes—without changing how your teams work.
        </Subheading>
        <div className="flex items-center gap-6">
          <Button className="shadow-brand">Start your free trial</Button>
          <Button asChild variant="outline">
            <Link href="#">View role based demos</Link>
          </Button>
        </div>
        <LandingImages />
      </Container>
      <GradientDivider />
    </section>
  );
};
