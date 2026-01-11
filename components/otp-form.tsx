"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { toast } from "sonner";
import { verifyOtp, resendOtp } from "@/lib/auth/OtpService";
import { handleLogoutOtp } from "@/lib/services/AuthLocalService";
import { ApiResponse } from "@/lib/types/apiResponse";
import { LoginResponse } from "@/lib/types/authTypes";
import { OK, BAD_REQUEST } from "@/lib/services/statusCodes";

export function OtpForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace - move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Validate 4-digit string
    if (!/^\d{4}$/.test(pastedData)) {
      toast.error("Please paste a valid 4-digit code");
      return;
    }

    const digits = pastedData.split("");
    setOtp(digits);
    inputRefs.current[3]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toast.error("Please enter the complete 4-digit code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp(otpString);
      const res = response as ApiResponse<LoginResponse>;

      if (res.status === OK) {
        toast.success("Email verified successfully!");

        // Determine redirect based on context
        const verifyRegister = sessionStorage.getItem("verifyRegister");
        const verifyForLogin = sessionStorage.getItem("verifyForLogin");
        const verifyForForgotPassword = sessionStorage.getItem("verifyForForgotPassword");

        // Clear OTP session
        handleLogoutOtp();

        if (verifyForForgotPassword) {
          router.push("/reset-password");
        } else if (verifyRegister || verifyForLogin) {
          router.push("/multi-step-form");
        } else {
          router.push("/login");
        }
      } else if (res.status === BAD_REQUEST) {
        toast.error(res.message || "Invalid OTP code");
      }
    } catch (error: any) {
      if (error.response?.status === BAD_REQUEST) {
        const message = error.response.data?.message || "Invalid OTP code";
        toast.error(message);
      } else {
        toast.error("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    try {
      await resendOtp();
      toast.success("OTP resent successfully! Check your email.");
      setIsResendDisabled(true);
      setResendCountdown(30);
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    handleLogoutOtp();
    router.push("/login");
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      {/* OTP Input Fields */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex gap-3 justify-center"
      >
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-14 h-14 text-center text-2xl font-semibold"
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Verify Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button
          onClick={handleVerifyOtp}
          className="w-full"
          disabled={!isOtpComplete || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </motion.div>

      {/* Resend OTP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="text-center text-sm"
      >
        <p className="text-muted-foreground mb-2">
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResendDisabled}
          className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResendDisabled
            ? `Resend in ${resendCountdown}s`
            : "Resend OTP"}
        </button>
      </motion.div>

      {/* Cancel Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </motion.div>
    </motion.div>
  );
}
