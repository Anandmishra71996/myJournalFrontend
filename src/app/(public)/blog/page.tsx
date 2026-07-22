import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { getAllPosts } from "@/data/blog-posts";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { BRAND_NAME, SITE_URL } from "@/constants/brand.constants";

export const metadata: Metadata = {
  title: "Blog — Behavioral Metrics & Self-Knowledge",
  description:
    "Guides on behavioral metrics, growth vs. fixed mindset, procrastination triggers, and how to turn your own journal into evidence about how you actually operate.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: `Blog | ${BRAND_NAME}`,
    description:
      "Guides on behavioral metrics, growth vs. fixed mindset, procrastination triggers, and how to turn your own journal into evidence about how you actually operate.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-background text-[color:var(--color-text-primary)]">
      <BlogHeader />

      <section className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            The {BRAND_NAME} Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Guides on behavioral metrics and self-knowledge — how to measure
            mindset, procrastination, and burnout from your own writing, with
            evidence instead of guesswork.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6 transition duration-200 hover:border-[color:var(--color-primary)]/50 hover:shadow-xl sm:p-8"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {post.readingTimeMinutes} min read
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition hover:text-[color:var(--color-primary)]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mb-4 leading-relaxed text-[color:var(--color-text-secondary)]">
                {post.description}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-primary)]"
              >
                Read the post
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <BlogFooter />
    </main>
  );
}
