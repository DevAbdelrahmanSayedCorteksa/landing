"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Divider } from "./ui/divider";
import { IconBrandGoogle, IconEye, IconEyeOff } from "@tabler/icons-react";
import { motion } from "motion/react";
import { sileo } from "sileo";
import { login } from "@/lib/auth/LoginService";
import {
  handleLogin,
  handleOtpLogin,
  saveWorkspaceSubdomain,
  buildSSORedirectUrl,
} from "@/lib/services/AuthLocalService";
import { ApiResponse } from "@/lib/types/apiResponse";
import { LoginResponse } from "@/lib/types/authTypes";
import { OK, ACCEPTED, UNAUTHORIZED_ERROR } from "@/lib/services/statusCodes";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("login");
  const tCommon = useTranslations("common");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);
      const res = response as ApiResponse<LoginResponse>;

      if (res.status === OK) {
        sileo.success({ title: t("loginSuccess"), description: t("loginSuccessDesc") });
        const loginData = res.data;

        // System admin - always redirect to CRM (no subdomain needed)
        if (loginData.isSystemAdmin) {
          const ssoUrl = buildSSORedirectUrl(
            null,
            loginData.token,
            loginData.refresh_token || "",
            true
          );
          window.location.href = ssoUrl;
        }
        // Regular user with workspaces - redirect to subdomain CRM
        else if (loginData.workspaces && loginData.workspaces.length > 0) {
          const subdomain = loginData.workspaces[0].subdomain;
          saveWorkspaceSubdomain(subdomain);

          const ssoUrl = buildSSORedirectUrl(
            subdomain,
            loginData.token,
            loginData.refresh_token || "",
            false
          );
          window.location.href = ssoUrl;
        }
        // No workspaces and not admin - redirect to multi-step form
        else {
          handleLogin(loginData);
          router.push("/multi-step-form");
        }
      } else if (res.status === ACCEPTED) {
        handleOtpLogin(res.data.token);
        sessionStorage.setItem("verifyForLogin", "true");
        sileo.info({ title: t("verifyOtp"), description: t("verifyOtpDesc") });
        router.push("/otp");
      } else {
        sileo.error({ title: t("loginFailed"), description: t("loginFailedDesc") });
      }
    } catch (error: any) {
      if (error.response?.status === UNAUTHORIZED_ERROR) {
        handleOtpLogin(error.response.data.data.otpToken);
        sessionStorage.setItem("verifyRegister", "true");
        sileo.error({ title: t("loginFailed"), description: t("loginFailedDesc") });
        router.push("/otp");
      } else {
        sileo.error({ title: t("loginFailed"), description: t("loginFailedDesc") });
      }
    } finally {
      setIsLoading(false);
    }
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
          {t("continueWithGoogle")}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Divider>{tCommon("or")}</Divider>
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Label htmlFor="email" className="block mb-3">{tCommon("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={tCommon("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </motion.div>

      {/* Password Field */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Label htmlFor="password" className="block mb-3">{tCommon("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={tCommon("passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
            {t("rememberMe")}
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t("forgotPassword")}
        </Link>
      </motion.div>

      {/* Sign In Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("signingIn") : tCommon("signIn")}
        </Button>
      </motion.div>

      {/* Sign Up Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.0 }}
        className="text-center text-sm text-muted-foreground"
      >
        {t("noAccount")}{" "}
        <Link
          href="/signup"
          className="text-primary hover:underline font-medium"
        >
          {tCommon("signup")}
        </Link>
      </motion.p>
    </motion.form>
  );
}
