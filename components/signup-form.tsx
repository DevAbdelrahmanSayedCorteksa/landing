"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Divider } from "./ui/divider";
import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { motion } from "motion/react";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Signup form submitted");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Google Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Button type="button" variant="outline" className="w-full gap-2 justify-center">
          <IconBrandGoogle className="size-4" />
          Continue with Google
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Divider>Or</Divider>
      </motion.div>

      {/* Email */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="space-y-2"
      >
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" placeholder="you@example.com" required />
      </motion.div>

      {/* Password */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="space-y-2"
      >
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
          </button>
        </div>
      </motion.div>

      {/* Confirm Password */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="space-y-2"
      >
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
          </button>
        </div>
      </motion.div>

      {/* Terms Checkbox */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
        className="flex items-start gap-2"
      >
        <Checkbox
          id="terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          required
        />
        <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-tight">
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </Label>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 1.0 }}
      >
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </motion.div>

      {/* Login Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
        className="text-center text-sm text-muted-foreground"
      >
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </motion.p>
    </motion.form>
  );
}
