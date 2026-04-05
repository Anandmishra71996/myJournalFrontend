"use client";

import { Shield, Lock } from "lucide-react";

export default function PrivacySection() {
  return (
    <div className="w-full rounded-lg bg-surface-container-low/50 backdrop-blur-sm p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-dim/20 to-primary/20 mb-2">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-manrope text-headline-sm font-bold text-on-surface">
          Your mind is a private place.
        </h2>
        <p className="text-body-md text-on-surface-variant/70 max-w-2xl mx-auto">
          We take your privacy seriously. Your journal entries, goals, and
          personal reflections are encrypted end-to-end. We will never read,
          share, or sell your data to third parties. Your thoughts are yours
          alone.
        </p>
      </div>

      {/* Privacy Features */}
      <div className="grid sm:grid-cols-2 gap-4 pt-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-high/30">
          <div className="shrink-0 mt-1">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-label-lg font-semibold text-on-surface mb-1">
              256-bit Encryption
            </h3>
            <p className="text-body-sm text-on-surface-variant/70">
              Bank-level security protects all your data at rest and in transit
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-high/30">
          <div className="shrink-0 mt-1">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-label-lg font-semibold text-on-surface mb-1">
              Zero Data Sharing
            </h3>
            <p className="text-body-sm text-on-surface-variant/70">
              Your personal reflections stay private and are never shared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
