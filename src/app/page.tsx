"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  Bars3Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/store/authStore";
import { BRAND_NAME } from "@/constants/brand.constants";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/journal");
    }
  }, [isAuthenticated, router]);

  const features = [
    {
      title: "AI Journal Insights",
      description:
        "Analyze writing patterns, emotional tone, and recurring themes so your journal becomes actionable mental wellness clarity.",
      icon: ChartBarIcon,
      className: "md:col-span-2",
    },
    {
      title: "Conversational AI Journaling",
      description:
        "Talk through your thoughts when the page feels blank. AI journaling prompts nudge you toward deeper self-reflection.",
      icon: ChatBubbleBottomCenterTextIcon,
    },
    {
      title: "Smart Daily Prompts",
      description:
        "Context-aware journaling prompts adapt to your mood, goals, and recent entries to keep your self-improvement writing flowing.",
      icon: LightBulbIcon,
    },
    {
      title: "Private Encrypted Journal",
      description:
        "Your personal journal is end-to-end encrypted. We never sell data or train AI on your writing—privacy is foundational.",
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
              {BRAND_NAME}
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
            <a
              href="#about"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              About
            </a>
            <a
              href="#contact"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              Contact
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
            <button
              className="ml-1 rounded-lg p-2 text-[color:var(--color-text-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-surface-high)_80%,transparent)] hover:text-[color:var(--color-text-primary)] md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[color:color-mix(in_srgb,var(--color-border)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--color-background)_95%,transparent)] px-4 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col gap-1">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#testimonials", label: "Testimonials" },
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition hover:bg-[color:color-mix(in_srgb,var(--color-surface-high)_70%,transparent)] hover:text-[color:var(--color-text-primary)]"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
            <SparklesIcon className="h-4 w-4" />
            Now in Free Beta
          </div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            The free AI journal app for{" "}
            <span className="italic text-[color:var(--color-primary)]">
              mental wellness
            </span>{" "}
            and personal growth
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
            AIGoalReflect is an AI-powered journaling app that tracks your mood,
            spots emotional patterns, and turns your daily reflections into
            actionable personal growth insights—completely private and encrypted.
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
            Everything your mental wellness journal needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Designed for daily journaling, mood tracking, and self-reflection—
            powered by AI so your writing becomes real personal growth.
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

      <section
        id="tools"
        className="bg-surface/70 py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Your complete self-growth toolkit
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
              One app. Everything you need to journal, plan, track goals, and
              understand yourself with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ChatBubbleBottomCenterTextIcon,
                label: "AI Journal",
                description:
                  "A distraction-free AI-powered journal that listens, prompts, and learns from your writing to surface deeper patterns.",
                badge: "Core",
              },
              {
                icon: SparklesIcon,
                label: "AI Life Insights",
                description:
                  "Weekly AI-generated life insights synthesized from your journal entries — mood arcs, energy patterns, and growth themes.",
                badge: "AI-Powered",
              },
              {
                icon: CalendarDaysIcon,
                label: "Smart Planner",
                description:
                  "AI-linked task planner with calendar and list views. Tie tasks to goals and see your productivity alongside your emotional state.",
                badge: "Productivity",
              },
              {
                icon: CheckCircleIcon,
                label: "Goal Tracker",
                description:
                  "Set personal goals, break them into milestones, and let AI connect your daily journal reflections to your long-term progress.",
                badge: "Growth",
              },
              {
                icon: LightBulbIcon,
                label: "AI Companion Chat",
                description:
                  "Chat with an AI that knows your journal history. Ask questions, get personalized advice, or just talk through a hard day.",
                badge: "AI Chat",
              },
              {
                icon: DocumentTextIcon,
                label: "Journal Templates",
                description:
                  "Guided journaling templates for gratitude, CBT reflection, anxiety, morning pages, and goal reviews — ready to use instantly.",
                badge: "Templates",
              },
            ].map(({ icon: Icon, label, description, badge }) => (
              <article
                key={label}
                className="flex flex-col gap-4 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-background p-6 transition duration-200 hover:border-[color:var(--color-primary)]/50 hover:shadow-xl sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)] text-[color:var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-1 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
                    {badge}
                  </span>
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg font-bold tracking-tight">
                    {label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
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
                "AIGoalReflect helped me connect my midweek stress to poor sleep patterns. The insight quality feels surprisingly human.",
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
          ].map((testimonial) => (
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

      <section id="about" className="bg-surface/70 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              About {BRAND_NAME}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
              Building tools for self-awareness in a fast-paced world
            </p>
          </div>

          {/* Company Information */}
          <div className="mb-12 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_8%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface-elevated)))] p-8">
            <h3 className="mb-6 text-xl font-bold tracking-tight">
              Company Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-[color:var(--color-text-secondary)]">
                  Company Name
                </p>
                <p className="text-lg font-bold">AIGoalReflect</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-[color:var(--color-text-secondary)]">
                  Founded
                </p>
                <p className="text-lg font-bold">2026</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-[color:var(--color-text-secondary)]">
                  Founder & Lead Developer
                </p>
                <a
                  href="https://www.linkedin.com/in/anandmishraleaddeveloper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-lg font-bold text-[color:var(--color-primary)] transition hover:underline"
                >
                  Anand Mishra
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                  Lead Full-Stack Engineer | AI Systems & RAG Architect
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-[color:var(--color-text-secondary)]">
                  Team Size
                </p>
                <p className="text-lg font-bold">1 (Founder-Led)</p>
              </div>
              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-[color:var(--color-text-secondary)]">
                  Headquarters
                </p>
                <p className="text-lg font-bold">
                  Village Puremohan, Rampur Gauri, Pratapgarh 230001, Uttar
                  Pradesh, India
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Our Mission
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  We believe journaling shouldn't be a chore. {BRAND_NAME}{" "}
                  combines the timeless practice of self-reflection with modern
                  AI to help you understand your patterns, emotions, and growth
                  trajectory—all while keeping your thoughts completely private.
                </p>
              </div>

              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Privacy First
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  Your journal is your safe space. We use end-to-end encryption
                  for all entries, meaning only you can read your thoughts. We
                  don't sell data, train public models on your writing, or
                  compromise your privacy—ever.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Why We Built This
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  Traditional journaling apps felt static. Therapy journaling
                  prompts felt generic. We wanted something that actually
                  understood context, adapted to your writing style, and
                  revealed insights you might have missed—without sacrificing
                  the intimacy of a personal journal.
                </p>
              </div>

              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Our Founder
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  Founded by Anand Mishra, a Lead Full-Stack Engineer with
                  expertise in AI Systems and RAG Architecture. With AWS
                  certification and experience in modern tech stacks including
                  Angular, React, Node.js, and LangGraph, Anand combines
                  technical excellence with a passion for building meaningful
                  products that enhance self-awareness.
                </p>
              </div>

              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Open Beta
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  We're currently in free beta, which means you can explore all
                  features at no cost while we refine the experience. Your
                  feedback shapes the product, and early adopters will receive
                  special perks when we launch premium features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Get In Touch
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Questions, feedback, or just want to say hi? We'd love to hear from
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 text-xl font-bold tracking-tight">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)]">
                    <svg
                      className="h-5 w-5 text-[color:var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:hello@aigoalreflect.online"
                      className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-primary)]"
                    >
                      hello@aigoalreflect.online
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)]">
                    <svg
                      className="h-5 w-5 text-[color:var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Support</p>
                    <a
                      href="mailto:hello@aigoalreflect.online"
                      className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-primary)]"
                    >
                      hello@aigoalreflect.online
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:color-mix(in_srgb,var(--color-primary)_14%,transparent)]">
                    <svg
                      className="h-5 w-5 text-[color:var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Feedback</p>
                    <a
                      href="mailto:hello@aigoalreflect.online"
                      className="text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-primary)]"
                    >
                      hello@aigoalreflect.online
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6">
              <h4 className="mb-3 font-semibold">Beta User Support</h4>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                During our beta phase, we typically respond within 24 hours.
                Your feedback directly shapes the product roadmap, so we
                genuinely appreciate hearing from you.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
            <h3 className="mb-6 text-xl font-bold tracking-tight">
              Send us a message
            </h3>
            <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-background px-4 py-3 transition focus:border-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-background px-4 py-3 transition focus:border-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-background px-4 py-3 transition focus:border-[color:var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Everything you need to know about our free AI journaling app.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {[
            {
              q: "Is AIGoalReflect free to use?",
              a: "Yes, AIGoalReflect is completely free during our open beta. All features including AI insights, mood tracking, and encrypted journaling are available at no cost.",
            },
            {
              q: "Is my journal private and secure?",
              a: "Absolutely. All journal entries are end-to-end encrypted. We never sell your data or train public AI models on your writing.",
            },
            {
              q: "How does the AI journaling feature work?",
              a: "Our AI analyzes your journal entries to identify emotional patterns, mood trends, and recurring themes. It generates personalized insights and smart prompts to help you reflect more deeply and grow faster.",
            },
            {
              q: "Can I use AIGoalReflect for mental health journaling?",
              a: "Yes. AIGoalReflect supports mental wellness through structured self-reflection, mood tracking, and CBT-inspired journaling prompts designed to help with anxiety, stress, and personal growth.",
            },
            {
              q: "Does it work as a mood tracker?",
              a: "Yes. Every journal entry is analyzed for emotional tone and sentiment. Over time you'll see mood trends, energy patterns, and emotional clarity scores on your dashboard.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface open:border-[color:var(--color-primary)]/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold">
                {q}
                <span className="shrink-0 text-[color:var(--color-primary)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="border-t border-[color:color-mix(in_srgb,var(--color-border)_50%,transparent)] px-6 pb-6 pt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {a}
              </p>
            </details>
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
            <p className="font-bold tracking-tight">{BRAND_NAME}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              © 2026 AIGoalReflect. Crafted for reflective minds.
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              Village Puremohan, Rampur Gauri, Pratapgarh 230001, India
            </p>
          </div>
          <div className="flex items-center gap-6 text-[color:var(--color-text-secondary)]">
            <Link
              href="/privacy-policy"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Terms
            </Link>
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
