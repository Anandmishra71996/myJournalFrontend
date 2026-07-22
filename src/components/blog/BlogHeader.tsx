import Link from "next/link";
import { BRAND_NAME } from "@/constants/brand.constants";

export default function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--color-border)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--color-background)_78%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight sm:text-2xl"
        >
          <span className="bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary-light)] bg-clip-text text-transparent">
            {BRAND_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <Link
            href="/blog"
            className="font-medium text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)]"
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="font-medium text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)]"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02]"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
