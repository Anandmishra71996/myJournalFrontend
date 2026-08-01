"use client";

import Link from "next/link";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { BRAND_NAME } from "@/constants/brand.constants";

export function ToolsHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--color-border)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--color-background)_78%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight sm:text-2xl"
        >
          <span className="bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary-light)] bg-clip-text text-transparent">
            {BRAND_NAME}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/tools"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)] sm:inline-block"
          >
            All Free Tools
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02]"
          >
            <SparklesIcon className="h-4 w-4" />
            Sign Up Free
          </Link>
        </div>
      </div>
    </header>
  );
}

export function ToolsBackLink() {
  return (
    <Link
      href="/tools"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)]"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      All free tools
    </Link>
  );
}

export function ToolsFooter() {
  return (
    <footer className="border-t border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:px-6">
        <p className="text-xs text-[color:var(--color-text-tertiary)]">
          © 2026 {BRAND_NAME}. Free tools, no login required.
        </p>
        <div className="flex items-center gap-6 text-[color:var(--color-text-secondary)]">
          <Link
            href="/pricing"
            className="transition hover:text-[color:var(--color-primary)]"
          >
            Pricing
          </Link>
          <Link
            href="/privacy-policy"
            className="transition hover:text-[color:var(--color-primary)]"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
