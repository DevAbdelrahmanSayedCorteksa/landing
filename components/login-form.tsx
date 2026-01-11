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

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Google Login Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 justify-center"
        >
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

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="space-y-2"
      >
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </motion.div>

      {/* Password Field */}
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
            {showPassword ? (
              <IconEyeOff className="size-4" />
            ) : (
              <IconEye className="size-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Remember Me & Forgot Password */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </motion.div>

      {/* Sign In Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </motion.div>

      {/* Sign Up Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.0 }}
        className="text-center text-sm text-muted-foreground"
      >
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </motion.p>
    </motion.form>
  );
}
