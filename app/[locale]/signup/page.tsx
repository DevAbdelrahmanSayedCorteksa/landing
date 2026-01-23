import type { Metadata } from "next";
import { SignupClient } from "./signup-client";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your free Corteksa account and start managing your projects, clients, and documents with AI-powered automation.",
  openGraph: {
    title: "Sign Up | Corteksa",
    description: "Create your free Corteksa account and get started today.",
    type: "website",
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
