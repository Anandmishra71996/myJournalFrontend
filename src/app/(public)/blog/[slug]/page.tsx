import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { getAllSlugs, getPostBySlug } from "@/data/blog-posts";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import MarkdownContent from "@/components/blog/MarkdownContent";
import { BRAND_NAME, SITE_URL } from "@/constants/brand.constants";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Person",
      name: "Anand Mishra",
    },
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512x512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <main className="min-h-screen bg-background text-[color:var(--color-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHeader />

      <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="mb-4 text-sm">
          <Link
            href="/blog"
            className="font-medium text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-primary)]"
          >
            ← Back to blog
          </Link>
        </p>

        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readingTimeMinutes} min read
        </p>

        <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {post.description}
        </p>

        <div className="mb-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <MarkdownContent content={post.content} />

        <div className="mt-14 rounded-3xl border border-[color:var(--color-primary)]/30 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface-elevated)))] p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight">
            See these patterns in your own journal
          </h2>
          <p className="mx-auto mb-6 max-w-md text-[color:var(--color-text-secondary)]">
            {BRAND_NAME} reads across your entries and detects mindset,
            procrastination, and burnout patterns automatically — with the
            exact excerpt behind each one.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02]"
          >
            Start Free
            <SparklesIcon className="h-5 w-5" />
          </Link>
        </div>

        <p className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-primary)]"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
            More posts
          </Link>
        </p>
      </article>

      <BlogFooter />
    </main>
  );
}
