"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  extractCallbackParams,
  retrievePKCEParams,
  validateState,
} from "@/utils/pkce";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode or re-renders
    if (hasProcessed.current) {
      return;
    }

    const handleCallback = async () => {
      // Mark as processing to prevent duplicate calls
      hasProcessed.current = true;

      try {
        // Retrieve stored PKCE parameters FIRST (they get cleared on first retrieval)
        const { codeVerifier, state: storedState } = retrievePKCEParams();

        // If parameters are null, it means this is a re-render and we already processed
        // Exit silently without error
        if (!codeVerifier || !storedState) {
          console.log(
            "OAuth callback already processed, skipping duplicate execution",
          );
          return;
        }

        // Extract callback parameters from URL
        const {
          code,
          state: receivedState,
          error,
          error_description,
        } = extractCallbackParams();

        // Check for OAuth errors
        if (error) {
          throw new Error(error_description || error);
        }

        // Validate authorization code
        if (!code) {
          throw new Error("No authorization code received");
        }

        // Validate state parameter (CSRF protection)
        if (!validateState(receivedState, storedState)) {
          throw new Error(
            "Invalid state parameter. Possible CSRF attack detected.",
          );
        }

        // Exchange authorization code for tokens
        const response = await api.post("/auth/google/callback", {
          code,
          codeVerifier,
          state: receivedState,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || "Authentication failed");
        }

        const { user } = response.data.data;

        // Update auth store
        setUser(user);

        setStatus("success");
        toast.success("Successfully signed in with Google!");

        // Redirect based on profile completion status
        setTimeout(() => {
          if (user.isProfileCompleted === false) {
            router.push("/profile");
          } else {
            router.push("/journal");
          }
        }, 1000);
      } catch (error: any) {
        console.error("Google OAuth callback error:", error);
        setStatus("error");
        setErrorMessage(error.message || "Authentication failed");
        toast.error(error.message || "Failed to sign in with Google");

        // Redirect to login after showing error
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, []); // Empty dependency array - only run once

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-background)" }}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full text-center"
        style={{
          backgroundColor: "var(--color-surface-elevated)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
        }}
      >
        {status === "loading" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{
                  borderColor: "var(--color-outline)",
                  borderTopColor: "var(--color-primary)",
                }}
              ></div>
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Completing Sign In...
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Please wait while we verify your Google account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, #22c55e 18%, transparent)",
                }}
              >
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Success!
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              You've been successfully signed in with Google.
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Redirecting...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-error) 18%, transparent)",
                }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: "var(--color-error)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Authentication Failed
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {errorMessage}
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
