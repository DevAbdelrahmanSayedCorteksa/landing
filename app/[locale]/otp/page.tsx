import type { Metadata } from "next";
import { OtpClient } from "./otp-client";

export const metadata: Metadata = {
  title: "Verify OTP | Corteksa",
  description: "Verify your one-time password to continue.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OtpPage() {
  return <OtpClient />;
}
