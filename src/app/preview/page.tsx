"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              Journal
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-gray-400">Reflect, Grow, Thrive</p>
        </div>

        {/* Preview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <ClockIcon className="h-20 w-20 text-indigo-600 dark:text-indigo-400" />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Awaiting Approval
            </h2>

            {/* Message */}
            <div className="space-y-4 mb-8">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Thanks for signing up! Your account is pending admin approval.
              </p>
              
              {email && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Account
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white break-all">
                    {email}
                  </p>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-300">
                We'll notify you via email when you're ready to start journaling. This usually takes 24-48 hours.
              </p>

              {/* What happens next */}
              <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-left">
                <p className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                  What happens next?
                </p>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2 text-indigo-600 dark:text-indigo-400">1.</span>
                    <span>Our team reviews your registration</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2 text-indigo-600 dark:text-indigo-400">2.</span>
                    <span>You'll receive an email notification once approved</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2 text-indigo-600 dark:text-indigo-400">3.</span>
                    <span>Simply log in and start your journaling journey!</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Back to Login
              </Link>
              
              <Link
                href="/"
                className="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-all duration-200"
              >
                Go to Home
              </Link>
            </div>

            {/* Beta Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🧪 We're in beta testing mode. Thank you for your patience while we prepare an amazing experience for you!
              </p>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions?{" "}
            <a
              href="mailto:support@yourapp.com"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
