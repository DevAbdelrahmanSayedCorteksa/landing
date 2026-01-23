"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { sendForgotPasswordEmail } from "@/lib/auth/ForgotPasswordService";
import { handleOtpLogin } from "@/lib/services/AuthLocalService";
import { ApiResponse } from "@/lib/types/apiResponse";
import { ACCEPTED, BAD_REQUEST } from "@/lib/services/statusCodes";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await sendForgotPasswordEmail(email);

      if (response.status === ACCEPTED) {
        toast.success("OTP sent to your email. Please verify to reset your password.");
        sessionStorage.setItem("verifyForForgotPassword", "true");
        if (response.data?.data?.otpToken) {
          handleOtpLogin(response.data.data.otpToken);
        }
        router.push("/otp");
      } else {
        setSubmitted(true);
      }
    } catch (error: any) {
      if (error.response?.status === BAD_REQUEST) {
        const message = error.response.data?.message || "Failed to send reset email";
        toast.error(message);
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <IconCheck className="size-8 text-primary" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            If you don't receive an email within a few minutes, please check your spam folder.
          </p>
        </div>

        {/* Back to Login */}
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href="/login">
            <IconArrowLeft className="size-4" />
            Back to login
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Label htmlFor="email" className="block mb-3">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </motion.div>

      {/* Back to Login Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="text-center"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="size-4" />
          Back to login
        </Link>
      </motion.div>
    </motion.form>
  );
}
