"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { validateLoginForm } from "@/validations";
import api from "@/lib/api";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  storePKCEParams,
  buildGoogleAuthUrl,
} from "@/utils/pkce";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const validateField = (field: string, value: string) => {
    const validation = validateLoginForm({
      email: field === "email" ? value : formData.email,
      password: field === "password" ? value : formData.password,
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
    setFormData({ ...formData, [name]: trimmedValue });

    if (touched[name]) {
      validateField(name, trimmedValue);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field as keyof typeof formData]);
  };

  const isFormValid = () => {
    const validation = validateLoginForm(formData);
    return validation.success && !Object.keys(errors).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate entire form
    const validation = validateLoginForm(formData);

    if (!validation.success) {
      setErrors(validation.errors || {});
      toast.error("Please fix the errors above");
      return;
    }

    setLoading(true);
    try {
      // Call API directly to check for requiresApproval response
      const response = await api.post('/auth/login', { 
        email: formData.email, 
        password: formData.password 
      });

      // Check if user requires beta approval
      if (response.data.requiresApproval) {
        const { user } = response.data.data;
        toast.info("Your account is pending approval");
        router.push(`/preview?email=${encodeURIComponent(user.email)}`);
        return;
      }

      // Normal login flow - update auth store
      const { user } = response.data.data;
      useAuthStore.setState({ user, isAuthenticated: true });

      toast.success("Welcome back!");

      // Redirect based on profile completion
      if (user?.isProfileCompleted === false) {
        router.push("/profile");
      } else {
        router.push("/journal");
      }
    } catch (error: any) {
      // Stay on page and show error - don't redirect
      const errorMessage = error.response?.data?.error || error.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error);
      // Keep the form data so user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;

    if (!clientId) {
      toast.error("Google login is not configured");
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
    } catch (error) {
      setGoogleLoading(false);
      toast.error("Unable to start Google login");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      <div className="absolute inset-0 lg:hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY7CpYs9a1-_YrTG6P9IJSgcm5MFBVQuXoGGSpsyZSBkxVsIfiX80q0gaf9VN41UryUnk7NUCRysnxphO1PMcXodz7ttBQ8fns7hPEl12zDJ92d2zEqk6hIFZZZfy4gYWPinWGLRXgffaPDfDx03asOOJjNnWkX8eMzQtR13EGMC5xiVhDj_L_OALCh6GahB3ovTxc0ccycNpn_kOYzrliW_1UyDJM0YuxzQ1bxcbJBgSidkNEd33Q_YLPIoVEhwVBmmbpIWTd_ok"
          alt="Midnight sky"
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/30 via-[var(--color-surface)]/70 to-[var(--color-surface)]" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[var(--color-primary-dark)]/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-[var(--color-secondary-dark)]/20 blur-[120px]" />
      </div>

      <main className="relative z-10 flex min-h-screen lg:flex-row">
        <section className="relative hidden overflow-hidden lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--color-surface)] opacity-40" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFvWgEfIdHRWlurV0SwMvEn_o6kmrlMnxD5oMYz8HbMe6rFE9xYoBOUnLPXdGGLre2WLrNuqIpspT4gWfQK8v_vRalJQ_-TKpwetbI0Y1Gvut6GvWcbyNvBDTAUNqeWZ2CDv6jnxORXd5q3dQYsdLCbLHi9jP8I2W8qebG231o1OoNyIrYQnbcskFtDb8oQduN20os0xFK3PPLibDKJ6epRVdBL9jGgMMcXE-DAOA_SvOqIA7cAl7B2rGGGGeu3rhwaMZEf_sD1v4"
            alt="Cozy midnight study"
            className="h-full w-full object-cover transition-transform duration-[3000ms] ease-out"
          />
          <div className="absolute inset-0 z-20 flex h-full flex-col justify-between p-16">
            <span className="font-headline text-3xl font-extrabold tracking-tighter text-[var(--color-text-primary)]">
              AIReflect
            </span>
            <div className="max-w-md">
              <h2 className="mb-6 font-headline text-5xl font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)]">
                Enter <span className="italic text-[var(--color-primary)]">AIReflect</span>.
              </h2>
              <p className="text-lg font-light leading-relaxed text-[var(--color-text-secondary)]">
                A sanctuary for your thoughts, captured in the stillness of the night. Rediscover the art of reflection.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-1 w-12 bg-[var(--color-primary)]" />
              <div className="h-1 w-12 bg-[var(--color-outline-variant)] opacity-30" />
              <div className="h-1 w-12 bg-[var(--color-outline-variant)] opacity-30" />
            </div>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-24">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-[var(--color-text-primary)]">
                AIReflect
              </h1>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Your thoughts, preserved in starlight.</p>
            </div>

            <div className="mb-10">
              <h2 className="mb-2 font-headline text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Welcome Back
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Please enter your credentials to access your journal.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="group flex items-center justify-center gap-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold transition-all duration-200 hover:bg-[var(--color-surface-high)] disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? "Loading" : "Google"}
              </button>
              <button
                type="button"
                onClick={() => toast.info("Apple sign-in coming soon")}
                className="group flex items-center justify-center gap-3 rounded-xl border border-[var(--color-outline-variant)]/30 bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold transition-all duration-200 hover:bg-[var(--color-surface-high)]"
              >
                <span className="material-symbols-outlined text-xl">ios</span>
                Apple
              </button>
            </div>

            <div className="relative mb-8 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-outline-variant)]/30" />
              </div>
              <span className="relative bg-[var(--color-surface)] px-4 text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                or continue with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[var(--color-text-secondary)]">
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
                  className={`w-full rounded-xl border bg-[var(--color-surface-low)] px-4 py-3.5 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                    errors.email && touched.email
                      ? "border-red-500"
                      : "border-[var(--color-outline-variant)]/30"
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-[var(--color-text-secondary)]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[var(--color-primary)] hover:opacity-80">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full rounded-xl border bg-[var(--color-surface-low)] px-4 py-3.5 pr-12 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-[var(--color-outline-variant)]/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="remember" className="text-sm text-[var(--color-text-secondary)]">
                  Remember for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] py-4 text-lg font-bold text-[var(--color-goal-cta-text)] shadow-xl shadow-[var(--color-primary)]/15 transition-all hover:shadow-[var(--color-primary)]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[var(--color-text-secondary)]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                  Create Archive
                </Link>
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-6">
              <Link href="/privacy-policy" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                Terms of Service
              </Link>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden">
        <div className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-surface-elevated)]/70 px-4 py-2 backdrop-blur-xl">
          <p className="text-xs text-[var(--color-text-secondary)]">
            End-to-end encrypted storage
          </p>
        </div>
      </div>
    </div>
  );
}
