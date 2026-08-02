import { Metadata } from "next";
import Link from "next/link";
import {
  BRAND_NAME,
  BRAND_DESCRIPTION,
  COMPANY_FOUNDED,
  SUPPORT_EMAIL,
} from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: `About | ${BRAND_NAME}`,
  description: `Learn about ${BRAND_NAME} — who built it, why it exists, and the company behind it.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Header */}
      <header className="border-b border-[var(--color-outline)]">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            About {BRAND_NAME}
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              What we do
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              {BRAND_DESCRIPTION} Instead of generic mood tracking, {BRAND_NAME}{" "}
              reads your journal entries and surfaces patterns in how you
              actually think and behave — mindset trends, procrastination
              triggers, burnout signals, and resilience — with direct quotes
              from your own writing as evidence.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              Founder
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              {BRAND_NAME} was built by{" "}
              <strong className="text-[var(--color-text-primary)]">
                Anand Mishra
              </strong>
              , a full-stack engineer and AI systems architect, starting in{" "}
              {COMPANY_FOUNDED}. The project began as a way to combine
              structured journaling with AI-driven behavioral analysis, so
              that self-reflection produces evidence-backed insight instead of
              generic feedback.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              Company
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              <em>
                TODO: fill in once incorporated — legal entity name,
                business registration number, and registered address will be
                listed here. {BRAND_NAME} currently operates as an
                individual/founder-run project pending formal incorporation.
              </em>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              Get in touch
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Questions, feedback, or partnership inquiries — reach us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              or visit our{" "}
              <Link
                href="/contact"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                Contact page
              </Link>
              .
            </p>
          </section>

          {/* Footer Navigation */}
          <div className="mt-12 flex flex-wrap gap-4 border-t border-[var(--color-outline)] pt-8">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Home
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
