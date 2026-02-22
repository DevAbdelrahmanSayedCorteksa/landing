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
import { register } from "@/lib/auth/RegisterService";
import { handleOtpLogin } from "@/lib/services/AuthLocalService";
import { ApiResponse } from "@/lib/types/apiResponse";
import { LoginResponse } from "@/lib/types/authTypes";
import { CREATED, BAD_REQUEST } from "@/lib/services/statusCodes";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("signup");
  const tCommon = useTranslations("common");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      sileo.error({ title: t("passwordMismatch"), description: t("passwordMismatchDesc") });
      return;
    }

    if (!acceptTerms) {
      sileo.error({ title: t("acceptTerms"), description: t("acceptTermsDesc") });
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        name: email.split("@")[0],
        email,
        password,
      });

      const res = response as ApiResponse<LoginResponse>;

      if (res.status === CREATED) {
        sileo.success({ title: t("registrationSuccess"), description: t("registrationSuccessDesc") });
        sessionStorage.setItem("verifyRegister", "true");
        handleOtpLogin(res.data.token);
        router.push("/otp");
      } else if (res.status === BAD_REQUEST) {
        sileo.error({ title: t("registrationFailed"), description: t("registrationFailedDesc") });
      }
    } catch (error: any) {
      if (error.response?.status === BAD_REQUEST) {
        sileo.error({ title: t("registrationFailed"), description: t("registrationFailedDesc") });
      } else {
        sileo.error({ title: t("registrationFailed"), description: t("registrationFailedDesc") });
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
      {/* Google Button */}
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

      {/* Email */}
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

      {/* Password */}
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

      {/* Confirm Password */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <Label htmlFor="confirmPassword" className="block mb-3">{tCommon("confirmPassword")}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={tCommon("passwordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <IconEyeOff className="size-4" />
            ) : (
              <IconEye className="size-4" />
            )}
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
        <Label
          htmlFor="terms"
          className="text-sm font-normal cursor-pointer leading-tight"
        >
          {t("termsAgree")}{" "}
          <Link href="/terms" className="text-primary hover:underline">
            {t("termsOfService")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            {t("privacyPolicy")}
          </Link>
        </Label>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 1.0 }}
      >
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t("creatingAccount") : tCommon("signup")}
        </Button>
      </motion.div>

      {/* Login Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
        className="text-center text-sm text-muted-foreground"
      >
        {t("haveAccount")}{" "}
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          {tCommon("signIn")}
        </Link>
      </motion.p>
    </motion.form>
  );
}
