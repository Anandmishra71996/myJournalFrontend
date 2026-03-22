"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/journal");
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      title: "AI-Powered Insights",
      description:
        "Analyze writing patterns, emotional tone, and recurring themes so your journal becomes actionable clarity.",
      icon: ChartBarIcon,
      className: "md:col-span-2",
    },
    {
      title: "Conversational Journaling",
      description:
        "Talk through your thoughts when the page feels blank. AI prompts nudge you toward deeper reflection.",
      icon: ChatBubbleBottomCenterTextIcon,
    },
    {
      title: "Smart Prompts",
      description:
        "Context-aware prompts adapt to your mood, goals, and recent entries to keep your writing flow alive.",
      icon: LightBulbIcon,
    },
    {
      title: "Private by Default",
      description:
        "Your writing remains personal and encrypted. Security is foundational, not an afterthought.",
      icon: ShieldCheckIcon,
      className: "md:col-span-2",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-background text-[color:var(--color-text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_8%_8%,color-mix(in_srgb,var(--color-primary)_30%,transparent),transparent_70%),radial-gradient(40rem_40rem_at_90%_20%,color-mix(in_srgb,var(--color-secondary)_18%,transparent),transparent_70%)]" />

      <header className="sticky top-0 z-50 border-b border-[color:color-mix(in_srgb,var(--color-border)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--color-background)_78%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="bg-gradient-to-r from-[color:var(--color-primary-dark)] to-[color:var(--color-primary-light)] bg-clip-text text-transparent">
              AIReflect
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-[color:var(--color-text-secondary)] md:flex">
            <a
              href="#features"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text-primary)] sm:px-5"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02] sm:px-6"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
            <SparklesIcon className="h-4 w-4" />
            Now in Free Beta
          </div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Turn your daily{" "}
            <span className="italic text-[color:var(--color-primary)]">
              thoughts
            </span>{" "}
            into clear insights with AI
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
            A private sanctuary for reflection that helps you spot emotional
            patterns, understand what drives your energy, and turn your writing
            into growth.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-7 py-4 text-base font-semibold text-white shadow-xl shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02]"
            >
              Start Journaling with AI
              <SparklesIcon className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[color:var(--color-border)] px-7 py-4 text-base font-semibold text-[color:var(--color-text-primary)] transition hover:bg-surface"
            >
              See how it works
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <p className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
            <LockClosedIcon className="h-4 w-4" />
            No credit card required. Encrypted and private by default.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] blur-3xl" />
          <div className="absolute -bottom-10 -right-12 h-40 w-40 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] blur-3xl" />
          <div className="relative rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface-elevated)_82%,transparent)] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] backdrop-blur-lg sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                  <ChartBarIcon className="h-5 w-5 text-[color:var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Insight</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                    Weekly Pattern
                  </p>
                </div>
              </div>
              <span className="text-xs text-[color:var(--color-text-tertiary)]">
                2m ago
              </span>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              "You seem most energized after deep-focus mornings, but stress
              spikes around looming deadlines."
            </p>
            <div className="mb-5 rounded-xl border border-[color:color-mix(in_srgb,var(--color-border)_60%,transparent)] bg-background p-4">
              <div className="mb-2 flex items-end justify-between text-xs">
                <span className="text-[color:var(--color-text-secondary)]">
                  Emotional Clarity
                </span>
                <span className="font-semibold text-[color:var(--color-primary)]">
                  84%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full w-[84%] bg-[color:var(--color-primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                  Weekly Mood
                </p>
                <p className="mt-1 text-sm font-semibold">Reflective</p>
              </div>
              <div className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                  Main Focus
                </p>
                <p className="mt-1 text-sm font-semibold">Career Growth</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface-elevated)_85%,transparent)] p-4 shadow-xl backdrop-blur-lg md:block">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
              <LockClosedIcon className="h-4 w-4 text-[color:var(--color-primary)]" />
              Encrypted
            </div>
            <p className="text-xs text-[color:var(--color-text-secondary)]">
              End-to-end encryption active for all journal entries.
            </p>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Deep insights. Zero friction.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Designed for the modern thinker who wants fewer distractions and
            more meaningful reflection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon, className }) => (
            <article
              key={title}
              className={`rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6 transition duration-200 hover:border-[color:var(--color-primary)]/50 hover:shadow-xl sm:p-8 ${className ?? ""}`}
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-[color:var(--color-primary)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-2xl font-bold tracking-tight">
                {title}
              </h3>
              <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-surface/70 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Three simple steps to better self-understanding
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
              A journaling ritual that feels effortless and becomes more
              valuable over time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                count: "01",
                title: "Write freely",
                description:
                  "Use a clean distraction-free editor and unload your thoughts naturally, without rigid templates.",
              },
              {
                count: "02",
                title: "AI analyzes your thoughts",
                description:
                  "Background analysis identifies sentiment shifts, recurring stressors, and growth opportunities.",
              },
              {
                count: "03",
                title: "Get insights and track growth",
                description:
                  "Review your emotional trends and weekly summaries to make better personal decisions.",
              },
            ].map((step) => (
              <article key={step.count} className="relative pt-7">
                <p className="pointer-events-none absolute -top-6 left-0 text-6xl font-black text-[color:color-mix(in_srgb,var(--color-primary)_14%,var(--color-text-tertiary))] sm:text-7xl">
                  {step.count}
                </p>
                <h3 className="relative mb-3 text-2xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="relative leading-relaxed text-[color:var(--color-text-secondary)]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Trusted by early users
          </h2>
          <p className="mt-4 text-[color:var(--color-text-secondary)]">
            Loved by builders, writers, and reflective thinkers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              initials: "SC",
              name: "Sarah Chen",
              role: "Product Designer",
              quote:
                "AIReflect helped me connect my midweek stress to poor sleep patterns. The insight quality feels surprisingly human.",
            },
            {
              initials: "MJ",
              name: "Marcus Jones",
              role: "Founder & Writer",
              quote:
                "The conversational journaling flow keeps me writing when I'm blocked. It turns venting into structured reflection.",
            },
            {
              initials: "EL",
              name: "Elena Lopez",
              role: "Medical Researcher",
              quote:
                "Strong privacy guarantees made me trust the app. I can journal honestly without worrying about where my data goes.",
            },
          ].map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="flex h-full flex-col justify-between rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-7"
            >
              <p className="mb-8 leading-relaxed text-[color:var(--color-text-secondary)]">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-sm font-bold text-[color:var(--color-primary)]">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_14%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_12%,var(--color-surface-elevated)))] p-8 text-center shadow-2xl sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Ready to find clarity?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[color:var(--color-text-secondary)]">
            Join the beta and build a reflection habit that actually sticks.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-8 py-4 text-base font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              Get Early Access
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[color:var(--color-border)] px-8 py-4 text-base font-semibold transition hover:bg-surface sm:w-auto"
            >
              View Demo
            </Link>
          </div>
          <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-primary)]">
            <LockClosedIcon className="h-4 w-4" />
            Your journal is private. Period.
          </p>
        </div>
      </section>

      <footer className="border-t border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 text-sm sm:flex-row sm:px-6 lg:px-8">
          <div>
            <p className="font-bold tracking-tight">AIReflect</p>
            <p className="mt-1 text-[color:var(--color-text-tertiary)]">
              © 2026 AIReflect. Crafted for reflective minds.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[color:var(--color-text-secondary)]">
            <a
              href="#"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Terms
            </a>
            <a
              href="#"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
