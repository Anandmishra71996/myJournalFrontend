"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const { user, isAuthenticated, refreshProfile } = useAuthStore();

  // Refresh profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile();
    }
  }, [isAuthenticated, refreshProfile]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

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
        "pushNotificationPromptDismissed"
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
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <Bars3Icon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full">
        {children}

        {/* Push Notification Prompt */}
        {showPushPrompt && (
          <PushNotificationPrompt onClose={() => setShowPushPrompt(false)} />
        )}
      </main>
    </div>
  );
}
