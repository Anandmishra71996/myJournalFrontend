import type { Metadata } from "next";
import Link from "next/link";
import { SparklesIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { ToolsHeader, ToolsFooter } from "@/components/tools/ToolsChrome";
import { PUBLIC_TOOLS } from "@/constants/tools.constants";
import { BRAND_NAME } from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: `Free AI Self-Knowledge Tools | ${BRAND_NAME}`,
  description:
    "Free, no-login AI tools: get your Big Five personality profile from your writing, a behavioral metrics snapshot, and a burnout check — each backed by evidence from your own words.",
};

export default function ToolsGalleryPage() {
  return (
    <main className="min-h-screen bg-background text-[color:var(--color-text-primary)]">
      <ToolsHeader />

      <section className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
          <SparklesIcon className="h-4 w-4" />
          Free — No Login Required
        </div>
        <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
          Free AI tools for self-knowledge
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
          Each tool is a one-shot demo of the same evidence-backed analysis
          engine behind {BRAND_NAME}. No account, no email required to see
          your result.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PUBLIC_TOOLS.map((tool) => {
            const isLive = tool.status === "live";
            const card = (
              <article
                className={`flex h-full flex-col gap-4 rounded-3xl border p-7 transition duration-200 ${
                  isLive
                    ? "border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface hover:border-[color:var(--color-primary)]/50 hover:shadow-xl"
                    : "border-[color:color-mix(in_srgb,var(--color-border)_45%,transparent)] bg-surface/60 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold tracking-tight">
                    {tool.name}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      isLive
                        ? "border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]"
                        : "border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)]"
                    }`}
                  >
                    {isLive ? "Live" : "Coming Soon"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                  {tool.tagline}
                </p>
                <p className="flex-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {tool.description}
                </p>
                {isLive && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-primary)]">
                    Try it free
                    <SparklesIcon className="h-4 w-4" />
                  </span>
                )}
              </article>
            );

            return isLive ? (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                {card}
              </Link>
            ) : (
              <div key={tool.slug}>{card}</div>
            );
          })}
        </div>

        <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-[color:var(--color-text-secondary)]">
          <LockClosedIcon className="h-4 w-4 shrink-0" />
          Pasted text isn't stored beyond generating your result. No account
          needed to try any tool.
        </p>
      </section>

      <ToolsFooter />
    </main>
  );
}
