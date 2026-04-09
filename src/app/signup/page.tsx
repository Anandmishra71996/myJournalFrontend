"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { validateSignupForm } from "@/validations";
import api from "@/lib/api";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  storePKCEParams,
  buildGoogleAuthUrl,
} from "@/utils/pkce";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register } = useAuthStore();
  const router = useRouter();

  const validateField = (field: string, value: string) => {
    const validation = validateSignupForm({
      name: field === "name" ? value : formData.name,
      email: field === "email" ? value : formData.email,
      password: field === "password" ? value : formData.password,
      confirmPassword:
        field === "confirmPassword" ? value : formData.confirmPassword,
    });

    const newErrors = { ...errors };
    if (validation.errors?.[field]) {
      newErrors[field] = validation.errors[field];
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const trimmedValue = value.trim();
    setFormData({
      ...formData,
      [name]: name === "password" || name === "name" ? value : trimmedValue,
    });

    if (touched[name]) {
      validateField(name, trimmedValue || value);
    }

    if (
      name === "password" &&
      formData.confirmPassword &&
      touched.confirmPassword
    ) {
      validateField("confirmPassword", formData.confirmPassword);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof typeof formData]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const validation = validateSignupForm(formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      toast.error("Please fix the errors below");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email: validation.data!.email,
        password: validation.data!.password,
        name: validation.data!.name,
      });

      if (response.data.requiresApproval) {
        const { user } = response.data.data;
        toast.info("Account created! Waiting for approval");
        router.push(`/preview?email=${encodeURIComponent(user.email)}`);
        return;
      }

      const { user } = response.data.data;
      useAuthStore.setState({ user, isAuthenticated: true });

      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Registration failed";
      toast.error(errorMessage);
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;

    if (!clientId) {
      toast.error("Google signup is not configured");
      return;
    }

    try {
      setGoogleLoading(true);
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();
      storePKCEParams(codeVerifier, state);
      const authUrl = buildGoogleAuthUrl(
        clientId,
        redirectUri,
        codeChallenge,
        state,
      );
      window.location.href = authUrl;
    } catch {
      setGoogleLoading(false);
      toast.error("Unable to start Google signup");
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      <div className="absolute inset-0 md:hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXA_jgkgCXTyJx0CRBlCQYrXXOgPxB51o1vdRrOvk7eCjGfcCKnlP_KgG2eFzZUwbTsLJFbWcb8zqODsASbKLQfS359iIcFOTJCD9XpO91KijKV9tQlTAEwRjs7PclZSV6iehBsLVsmZhTdsxd87jnt4FDEbtcutk1UTEBecErG-LLvk5yTdkuC3TuqSZ5r4h2c7oV77ddmBE1skHR4_hqQu78I8FjyrUGQfdWknFN_U4d4F-cdBz5Nd-VoUkLE1wTlytQNvif8wU"
          alt="Night sky"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/40 via-[var(--color-surface)]/70 to-[var(--color-surface)]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col md:flex-row">
        <section className="relative hidden overflow-hidden md:block md:h-auto md:w-1/2 lg:w-3/5">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent md:bg-gradient-to-r" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXA_jgkgCXTyJx0CRBlCQYrXXOgPxB51o1vdRrOvk7eCjGfcCKnlP_KgG2eFzZUwbTsLJFbWcb8zqODsASbKLQfS359iIcFOTJCD9XpO91KijKV9tQlTAEwRjs7PclZSV6iehBsLVsmZhTdsxd87jnt4FDEbtcutk1UTEBecErG-LLvk5yTdkuC3TuqSZ5r4h2c7oV77ddmBE1skHR4_hqQu78I8FjyrUGQfdWknFN_U4d4F-cdBz5Nd-VoUkLE1wTlytQNvif8wU"
            alt="Night sky over a still lake"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
            <div className="max-w-md">
              <span className="mb-6 inline-block rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                AIReflect
              </span>
              <h1 className="mb-4 font-headline text-4xl font-extrabold tracking-tight md:text-6xl">
                Capture the{" "}
                <span className="text-[var(--color-primary)]">unseen</span>.
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)]">
                Step into your private sanctuary. A space designed for
                reflection, clarity, and the quiet moments after dark.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen w-full items-start justify-center bg-transparent px-6 pb-8 pt-4 md:items-center md:bg-[var(--color-surface)] md:px-6 md:py-10 md:w-1/2 lg:w-2/5 lg:px-20">
          <div className="mt-2 w-full max-w-md space-y-10 rounded-xl  bg-[var(--color-surface-elevated)]/65 p-6 backdrop-blur-xl md:mt-0 md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
            <div className="space-y-2">
              <div className="mb-8 flex items-center gap-2">
                <span className="font-headline text-2xl font-bold tracking-tighter">
                  AIReflect
                </span>
              </div>
              <h2 className="font-headline text-3xl font-bold">
                Begin your journey
              </h2>
              <p className="hidden text-[var(--color-text-secondary)] md:block">
                Create your account to start archiving your thoughts.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    placeholder="John Doe"
                    autoComplete="name"
                    className={`w-full rounded-xl border bg-[var(--color-surface-low)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                      errors.name && touched.name
                        ? "border-red-500"
                        : "border-[var(--color-outline-variant)]/30"
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-[var(--color-surface-low)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-[var(--color-outline-variant)]/30"
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border bg-[var(--color-surface-low)] px-4 py-3 pr-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-[var(--color-outline-variant)]/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-xs text-red-400">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-[var(--color-text-secondary)]"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border bg-[var(--color-surface-low)] px-4 py-3 pr-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : "border-[var(--color-outline-variant)]/30"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-xs text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] py-4 font-bold text-[var(--color-goal-cta-text)] shadow-xl shadow-[var(--color-primary)]/10 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-[var(--color-outline-variant)]/20" />
                  <span className="mx-4 shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-[var(--color-outline-variant)]/20" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-high)] py-3 transition-colors duration-200 hover:bg-[var(--color-surface-bright)] disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toast.info("Apple sign-up coming soon")}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-high)] py-3 transition-colors duration-200 hover:bg-[var(--color-surface-bright)]"
                  >
                    <span className="material-symbols-outlined text-xl">
                      ios
                    </span>
                    <span className="text-sm font-medium">Apple</span>
                  </button>
                </div>
              </div>
            </form>

            <p className="pt-4 text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?
              <Link
                href="/login"
                className="ml-1 font-semibold text-[var(--color-primary)] hover:underline"
              >
                Log in
              </Link>
            </p>

            <footer className="hidden flex-wrap justify-center gap-x-6 gap-y-2 pt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)] md:flex">
              <Link href="/privacy-policy" className="hover:text-[var(--color-primary)]">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-[var(--color-primary)]">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-[var(--color-primary)]">
                Support
              </Link>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
