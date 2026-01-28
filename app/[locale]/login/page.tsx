import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your Corteksa account to access your workspace and manage your projects, clients, and documents.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Login | Corteksa",
    description: "Sign in to your Corteksa account to continue.",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
