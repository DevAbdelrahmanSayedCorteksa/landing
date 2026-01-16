import React from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { LandingImages } from "./landing-images";
import { GradientDivider } from "./gradient-divider";

export const Outcomes = () => {
  return (
    <section className="pt-10 md:pt-20 lg:pt-32 relative overflow-hidden">
      <Container>
        <Heading>
          More features <br />
          coming soon
        </Heading>

        <Subheading className="py-8">
          We&apos;re constantly building new capabilities to help you work
          smarter. Here&apos;s what&apos;s on the horizon.
        </Subheading>

        <LandingImages
          firstImageSrc={"https://assets.aceternity.com/screenshots/5.jpg"}
          secondImageSrc={"https://assets.aceternity.com/screenshots/6.jpg"}
        />
      </Container>
      <GradientDivider />
    </section>
  );
};
