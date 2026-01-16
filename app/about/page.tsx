import { Metadata } from "next";
import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title: "About Us | Corteksa",
  description:
    "Learn about Corteksa - the AI-powered CRM platform transforming how teams work together.",
};

export default function AboutPage() {
  return <AboutClient />;
}
