"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";
import { BRAND_NAME } from "@/constants/brand.constants";

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      toast.error("OTP expired. Please request a new one.");
    }

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      setStep("otp");
      setTimeLeft(120);
      setTimerActive(true);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified");
      setStep("reset");
      setTimerActive(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("New OTP sent to your email");
      setTimeLeft(120);
      setTimerActive(true);
      setOtp("");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-2">
              {BRAND_NAME}
            </h1>
          </Link>
          <p className="text-[var(--color-text-secondary)]">
            Reset Your Password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[var(--color-surface-high)] rounded-2xl shadow-2xl p-8 border border-[var(--color-outline-variant)]/30">
          {/* Back to Login Link */}
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Login
          </Link>

          {/* Step 1: Enter Email */}
          {step === "email" && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                Forgot Password?
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Enter your email and we'll send you an OTP to reset your
                password.
              </p>

              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-outline-variant)]/50 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-low)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary)]/20"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Enter OTP */}
          {step === "otp" && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                Enter OTP
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-2">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>

              {timerActive && (
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-lg font-mono text-lg font-bold">
                    ⏱️ {formatTime(timeLeft)}
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
                  >
                    Enter 6-digit OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(value);
                    }}
                    className="w-full px-4 py-3 border border-[var(--color-outline-variant)]/50 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-low)] text-[var(--color-text-primary)] outline-none text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary)]/20"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading || timerActive}
                    className="text-sm text-[var(--color-primary)] hover:opacity-80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {timerActive ? "Wait to resend OTP" : "Resend OTP"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                Reset Password
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Enter your new password below
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-outline-variant)]/50 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-low)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[var(--color-outline-variant)]/50 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all bg-[var(--color-surface-low)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-primary)]/20"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Alternative Action */}
        <div className="text-center mt-6">
          <p className="text-[var(--color-text-secondary)]">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[var(--color-primary)] hover:opacity-80 font-semibold"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
