"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/constants/brand.constants";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

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
            AI-Powered Personal Journal
          </p>
        </div>

        {/* Preview Card */}
        <div className="bg-[var(--color-surface-high)] rounded-2xl shadow-2xl p-8 border border-[var(--color-outline-variant)]/30">
          <div className="text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <ClockIcon className="h-20 w-20 text-[var(--color-primary)]" />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
              Awaiting Approval
            </h2>

            {/* Message */}
            <div className="space-y-4 mb-8">
              <p className="text-[var(--color-text-secondary)] text-lg">
                Thanks for signing up! Your account is pending admin approval.
              </p>

              {email && (
                <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-lg p-4">
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                    Account
                  </p>
                  <p className="font-medium text-[var(--color-text-primary)] break-all">
                    {email}
                  </p>
                </div>
              )}

              <p className="text-[var(--color-text-secondary)]">
                We'll notify you via email when you're ready to start
                journaling. This usually takes 24-48 hours.
              </p>

              {/* What happens next */}
              <div className="mt-6 bg-[var(--color-surface-low)] rounded-lg p-4 text-left">
                <p className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                  What happens next?
                </p>
                <ol className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2 text-[var(--color-primary)]">
                      1.
                    </span>
                    <span>Our team reviews your registration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2 text-[var(--color-primary)]">
                      2.
                    </span>
                    <span>
                      You'll receive an email notification once approved
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2 text-[var(--color-primary)]">
                      3.
                    </span>
                    <span>
                      Simply log in and start your journaling journey!
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md shadow-[var(--color-primary)]/20"
              >
                Back to Login
              </Link>

              <Link
                href="/"
                className="block w-full py-3 px-4 bg-[var(--color-surface-bright)] hover:bg-[var(--color-surface-high)] text-[var(--color-text-primary)] font-semibold rounded-lg transition-all duration-200"
              >
                Go to Home
              </Link>
            </div>

            {/* Beta Notice */}
            <div className="mt-6 pt-6 border-t border-[var(--color-outline)]">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                🧪 We're in beta testing mode. Thank you for your patience while
                we prepare an amazing experience for you!
              </p>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Questions?{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[var(--color-primary)] hover:opacity-80 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
