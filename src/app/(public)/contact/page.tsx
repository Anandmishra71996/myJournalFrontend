import { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: `Contact | ${BRAND_NAME}`,
  description: `Get in touch with the ${BRAND_NAME} team for support, feedback, or partnership inquiries.`,
};

export default function ContactPage() {
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
            Contact Us
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              Email
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              For support, feedback, press, or partnership inquiries, email us
              at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              . We aim to respond within 1-2 business days.
            </p>
            {/*
              NOTE: this address should be a mailbox on the aigoalreflect.online
              domain (not a personal Gmail/Outlook address) before this site is
              submitted for cloud-credit or App Store review — reviewers check
              that support contacts match the site's domain.
            */}
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-text-primary)]">
              About the company
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Read more about who builds {BRAND_NAME} on our{" "}
              <Link
                href="/about"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                About page
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
              href="/about"
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              About
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
