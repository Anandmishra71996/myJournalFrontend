import Link from "next/link";
import { BRAND_NAME } from "@/constants/brand.constants";

export default function BlogFooter() {
  return (
    <footer className="border-t border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm sm:flex-row sm:px-6">
        <div>
          <p className="font-bold tracking-tight">{BRAND_NAME}</p>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            © 2026 AIGoalReflect. Your journal, analyzed.
          </p>
        </div>
        <div className="flex items-center gap-6 text-[color:var(--color-text-secondary)]">
          <Link href="/" className="transition hover:text-[color:var(--color-primary)]">
            Home
          </Link>
          <Link href="/pricing" className="transition hover:text-[color:var(--color-primary)]">
            Pricing
          </Link>
          <Link href="/blog" className="transition hover:text-[color:var(--color-primary)]">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}
