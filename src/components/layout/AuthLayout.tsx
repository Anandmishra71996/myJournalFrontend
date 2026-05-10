"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Bars3Icon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import BetaBanner from "@/components/BetaBanner";
import { BRAND_NAME } from "@/constants/brand.constants";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  const pageTitles: Record<string, string> = {
    "/journal": "Journal",
    "/templates": "Templates",
    "/goals": "Goals",
    "/insights": "Insights",
    "/profile": "Profile",
    "/chat": "Personal Growth AI",
    "/subscription": "Subscription",
  };

  const pageTitle =
    Object.entries(pageTitles).find(([route]) =>
      pathname.startsWith(route),
    )?.[1] || "Workspace";

  // AuthProvider (root layout) already ran checkAuth on app mount and populated
  // the store. No need to call it again here — just react to what's in the store.
  useEffect(() => {
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      router.push("/");
    }
  }, [isChecking, isAuthenticated, router]);

  // Redirect to profile if not completed (except if already on profile page)
  useEffect(() => {
    console.log("Checking profile completion:", user);
    if (user && user.isProfileCompleted === false && pathname !== "/profile") {
      router.push("/profile");
    }
  }, [user, router, pathname]);

  // Check if we should show push notification prompt after profile is loaded
  useEffect(() => {
    const checkPushNotificationPrompt = () => {
      // Only proceed if user is authenticated and profile is completed
      if (!isAuthenticated || !user || user.isProfileCompleted !== true) {
        return;
      }

      // Check if browser supports notifications
      if (typeof window === "undefined" || !("Notification" in window)) {
        return;
      }

      // Check if user has already responded to the prompt
      const hasSeenPrompt = localStorage.getItem(
        "pushNotificationPromptDismissed",
      );
      if (hasSeenPrompt) {
        return;
      }

      // Check if permission is already granted or denied
      if (
        Notification.permission === "granted" ||
        Notification.permission === "denied"
      ) {
        return;
      }

      // Show the prompt after a short delay
      setTimeout(() => {
        setShowPushPrompt(true);
      }, 1500);
    };

    checkPushNotificationPrompt();
  }, [user, isAuthenticated]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Show loading indicator while verifying authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="w-12 h-12 border-4 border-[var(--color-outline)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 620px at 80% -20%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent), var(--color-background)",
      }}
    >
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Beta Banner */}
      <BetaBanner />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        <header
          className="sticky top-0 z-30 border-b backdrop-blur-xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-surface-elevated) 82%, transparent)",
            borderColor:
              "color-mix(in srgb, var(--color-border) 60%, transparent)",
          }}
        >
          <div className="px-3 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{
                  color: "var(--color-text-secondary)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-surface) 75%, transparent)",
                }}
                aria-label="Open menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div className="min-w-0">
                <p
                  className="text-xs uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {BRAND_NAME}
                </p>
                <h1
                  className="text-base sm:text-lg font-semibold truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div
              className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-surface) 85%, transparent)",
                color: "var(--color-text-secondary)",
              }}
            >
              <CalendarDaysIcon className="w-4 h-4" />
              <span className="text-xs font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="text-right min-w-[120px]">
              <p
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Signed in as
              </p>
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {user?.name || user?.email || "User"}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto w-full">
          {children}

          {/* Push Notification Prompt */}
          {showPushPrompt && (
            <PushNotificationPrompt onClose={() => setShowPushPrompt(false)} />
          )}
        </main>
      </div>
    </div>
  );
}
