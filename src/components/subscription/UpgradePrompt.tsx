"use client";

import { Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpgradePromptProps {
  feature: string;
  message: string;
  upgradeTier?: string;
  className?: string;
  variant?: "inline" | "modal" | "banner";
}

/**
 * Reusable component to prompt users to upgrade when they hit plan limits
 * Follows the Midnight Archive design system with glassmorphism and tonal layering
 */
export function UpgradePrompt({
  feature,
  message,
  upgradeTier = "Reflect",
  className = "",
  variant = "inline",
}: UpgradePromptProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  // Inline variant - for blocking feature access in forms/buttons
  if (variant === "inline") {
    return (
      <div
        className={`
          group relative overflow-hidden rounded-md
          bg-surface-container-high/70 backdrop-blur-sm
          border border-outline-variant/15
          p-4
          ${className}
        `}
      >
        {/* Subtle gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <div className="rounded-full bg-primary/10 p-2">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-label-md font-medium text-on-surface mb-1">
              {feature}
            </h4>
            <p className="text-body-sm text-on-surface-variant/80 mb-3">
              {message}
            </p>

            <button
              onClick={handleUpgrade}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-md
                bg-gradient-to-br from-primary-dim to-primary
                text-on-primary text-label-sm font-medium
                hover:shadow-lg hover:shadow-primary/20
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface
              "
            >
              <Zap className="h-3.5 w-3.5" />
              Upgrade to {upgradeTier}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant - for top-of-page notifications
  if (variant === "banner") {
    return (
      <div
        className={`
          relative overflow-hidden rounded-md
          bg-surface-container-low/80 backdrop-blur-md
          border border-primary/20
          ${className}
        `}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-pulse" />

        <div className="relative flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <div className="rounded-full bg-primary/20 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>

            <div>
              <p className="text-body-md text-on-surface font-medium">
                {message}
              </p>
              <p className="text-body-sm text-on-surface-variant/70 mt-0.5">
                Unlock {feature} and more premium features
              </p>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            className="
              shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-md
              bg-gradient-to-br from-primary-dim to-primary
              text-on-primary text-label-md font-semibold
              hover:shadow-xl hover:shadow-primary/30
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface
            "
          >
            <Zap className="h-4 w-4" />
            View Plans
          </button>
        </div>
      </div>
    );
  }

  // Modal variant - for blocking interactions
  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        bg-surface-container backdrop-blur-xl
        border border-outline-variant/15
        p-6 text-center max-w-md mx-auto
        ${className}
      `}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5" />

      <div className="relative">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>

        <h3 className="text-headline-sm font-bold text-on-surface mb-2">
          {feature}
        </h3>

        <p className="text-body-md text-on-surface-variant/80 mb-6">
          {message}
        </p>

        <button
          onClick={handleUpgrade}
          className="
            inline-flex items-center gap-2 px-8 py-3 rounded-md w-full
            bg-gradient-to-br from-primary-dim to-primary
            text-on-primary text-label-lg font-semibold
            hover:shadow-2xl hover:shadow-primary/30
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface
          "
        >
          <Zap className="h-5 w-5" />
          Upgrade to {upgradeTier}
        </button>
      </div>
    </div>
  );
}
