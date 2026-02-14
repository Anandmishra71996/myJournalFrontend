"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  validateSignupForm,
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
  getPasswordStrengthWidth,
} from "@/validations";
import { GoogleButton, FacebookButton } from "@/components/auth/OAuthButtons";

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
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "fair" | "good" | "strong" | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, googleAuth, facebookAuth } = useAuthStore();
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

    // Update password strength
    if (name === "password" && value) {
      setPasswordStrength(getPasswordStrength(value));
    } else if (name === "password") {
      setPasswordStrength(null);
    }

    if (touched[name]) {
      validateField(name, trimmedValue || value);
    }

    // Update confirm password validation if it has a value
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
      await register(
        validation.data!.email,
        validation.data!.password,
        validation.data!.name
      );
      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (error: any) {
      // Stay on page and show error - don't redirect
      toast.error(error.message || "Registration failed");
      console.error("Signup error:", error);
      // Keep the form data so user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleId: string, email: string, name: string, avatar?: string) => {
    setLoading(true);
    try {
      await googleAuth(googleId, email, name, avatar);
      toast.success("Account created successfully!");
      router.push("/profile");
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
      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (error: any) {
      toast.error(error.message || "Facebook authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthError = (error: string) => {
    toast.error(error);
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

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us to start your journaling journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
                  errors.name && touched.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
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
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrengthColor(
                          passwordStrength || "weak"
                        )}`}
                        style={{
                          width: getPasswordStrengthWidth(
                            passwordStrength || "weak"
                          ),
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      {getPasswordStrengthLabel(passwordStrength || "weak")}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              {!errors.password && formData.password && (
                <p className="text-green-600 text-xs mt-1">
                  ✓ Password is strong
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all bg-gray-50 focus:bg-white ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-indigo-500"
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              {!errors.confirmPassword &&
                formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="text-green-600 text-xs mt-1">
                    ✓ Passwords match
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:shadow-lg disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold mt-8"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <GoogleButton 
              onSuccess={handleGoogleSuccess} 
              onError={handleOAuthError}
              text="signup"
            />
            <FacebookButton 
              onSuccess={handleFacebookSuccess} 
              onError={handleOAuthError}
              text="Sign up with Facebook"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                Sign In
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
