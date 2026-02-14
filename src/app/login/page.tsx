"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { validateLoginForm } from "@/validations";
import { GoogleButton, FacebookButton } from "@/components/auth/OAuthButtons";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, googleAuth, facebookAuth } = useAuthStore();
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
      await login(formData.email, formData.password);

      toast.success("Welcome back!");

      // Redirect based on profile completion
      const user = useAuthStore.getState().user;
      if (user?.isProfileCompleted === false) {
        router.push("/profile");
      } else {
        router.push("/journal");
      }
    } catch (error: any) {
      // Stay on page and show error - don't redirect
      toast.error(error.message || "An error occurred. Please try again.");
      console.error("Login error:", error);
      // Keep the form data so user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleId: string, email: string, name: string, avatar?: string) => {
    setLoading(true);
    try {
      await googleAuth(googleId, email, name, avatar);
      toast.success("Welcome back!");

      const user = useAuthStore.getState().user;
      if (user?.isProfileCompleted === false) {
        router.push("/profile");
      } else {
        router.push("/journal");
      }
    } catch (error: any) {
      toast.error(error.message || "Google authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSuccess = async (facebookId: string, email: string, name: string, avatar?: string) => {
    setLoading(true);
    try {
      await facebookAuth(facebookId, email, name, avatar);
      toast.success("Welcome back!");

      const user = useAuthStore.getState().user;
      if (user?.isProfileCompleted === false) {
        router.push("/profile");
      } else {
        router.push("/journal");
      }
    } catch (error: any) {
      toast.error(error.message || "Facebook authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthError = (error: string) => {
    toast.error(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Journal
            </h1>
          </Link>
          <p className="text-gray-600">Reflect, Grow, Thrive</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
                  errors.email && touched.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
                    errors.password && touched.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <GoogleButton 
              onSuccess={handleGoogleSuccess} 
              onError={handleOAuthError}
              text="signin"
            />
            <FacebookButton 
              onSuccess={handleFacebookSuccess} 
              onError={handleOAuthError}
              text="Sign in with Facebook"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
