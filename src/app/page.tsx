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
  CheckIcon,
  DocumentTextIcon,
  LockClosedIcon,
  MicrophoneIcon,
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
      title: "Behavioral Pattern Detection",
      description:
        "A weekly intelligence engine reads across your entries and detects how you actually operate — mindset trends, procrastination triggers, burnout signals, resilience, and execution ratio. Every pattern comes with evidence quoted from your own writing, not generic horoscope-style feedback.",
      icon: ChartBarIcon,
      className: "md:col-span-2",
    },
    {
      title: "An AI Coach That Knows Your History",
      description:
        "Chat with an AI grounded in your actual journals, goals, and insights. Ask “when do I procrastinate most?” and get an answer backed by your own entries.",
      icon: ChatBubbleBottomCenterTextIcon,
    },
    {
      title: "Voice Journaling",
      description:
        "Too tired to type? Speak your entry and it's transcribed automatically — then analyzed like any written entry.",
      icon: MicrophoneIcon,
    },
    {
      title: "Private by Design",
      description:
        "Your entries are encrypted at rest, stored in isolated per-user spaces, and never used to train AI models. Export or delete everything, anytime. In this category, privacy isn't a feature — it's the foundation.",
      icon: ShieldCheckIcon,
      className: "md:col-span-2",
    },
  ];

  const askExamples = [
    "When do I procrastinate most?",
    "What did I write about last Monday?",
    "What's been draining my energy lately?",
    "What triggers my best work?",
    "How is my mindset trending this month?",
    "What am I avoiding right now?",
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Start journaling and get weekly insights.",
      features: [
        "10 journal entries / month",
        "3 active goals",
        "Weekly insights",
        "Guided templates",
      ],
      cta: "Start Free",
      href: "/signup",
      highlighted: false,
    },
    {
      name: "Reflect",
      price: "$9.99",
      period: "/month",
      description: "The full behavioral intelligence experience.",
      features: [
        "100 entries / month, 10 goals",
        "AI coach chat with journal context",
        "Behavioral metrics & pattern evidence",
        "Custom templates",
      ],
      cta: "See Pricing",
      href: "/pricing",
      highlighted: true,
    },
    {
      name: "Thrive",
      price: "$19.99",
      period: "/month",
      description: "Everything, unlimited — plus voice.",
      features: [
        "Unlimited entries & goals",
        "Voice-to-text journaling",
        "AI agent tools (create goals from chat)",
        "Advanced behavioral insights",
      ],
      cta: "See Pricing",
      href: "/pricing",
      highlighted: false,
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
              href="#pricing"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              Pricing
            </a>
            <Link
              href="/tools"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              Free Tools
            </Link>
            <Link
              href="/blog"
              className="transition hover:text-[color:var(--color-text-primary)]"
            >
              Blog
            </Link>
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
                { href: "#pricing", label: "Pricing" },
                { href: "/tools", label: "Free Tools" },
                { href: "/blog", label: "Blog" },
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
            Evidence-Backed Self-Knowledge
          </div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Your journal,{" "}
            <span className="italic text-[color:var(--color-primary)]">
              analyzed
            </span>
            .
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
            {BRAND_NAME} detects your behavioral patterns — when you
            procrastinate, what triggers your best work, whether your mindset
            is trending growth or fixed — and proves it with evidence quoted
            from your own entries. Not another journaling app. A mirror.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-7 py-4 text-base font-semibold text-white shadow-xl shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02]"
            >
              Discover Your Patterns
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
            Free to start. No credit card. Your entries are never used to
            train AI models.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] blur-3xl" />
          <div className="absolute -bottom-10 -right-12 h-40 w-40 rounded-full bg-[color:color-mix(in_srgb,var(--color-secondary)_25%,transparent)] blur-3xl" />
          <div className="relative rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_70%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface-elevated)_82%,transparent)] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] backdrop-blur-lg sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-surface">
                  <ChartBarIcon className="h-5 w-5 text-[color:var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Pattern Detected</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                    Behavioral Intelligence
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_12%,transparent)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
                Evidence-Backed
              </span>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              You procrastinate most on tasks that feel important but
              undefined — most delays this month happened when the next step
              wasn't written down.
            </p>
            <div className="mb-5 rounded-xl border-l-2 border-[color:var(--color-primary)] bg-background p-3.5">
              <p className="text-xs italic leading-relaxed text-[color:var(--color-text-secondary)]">
                "I keep pushing the portfolio site to tomorrow. Honestly I
                don't even know what the first step is."
              </p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                From your entry — Tuesday
              </p>
            </div>
            <div className="mb-5 rounded-xl border border-[color:color-mix(in_srgb,var(--color-border)_60%,transparent)] bg-background p-4">
              <div className="mb-2 flex items-end justify-between text-xs">
                <span className="text-[color:var(--color-text-secondary)]">
                  Mindset — Growth vs Fixed
                </span>
                <span className="font-semibold text-[color:var(--color-primary)]">
                  Growth 62%
                </span>
              </div>
              <div className="flex h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full w-[62%] bg-emerald-500" />
                <div className="h-full w-[24%] bg-amber-400" />
                <div className="h-full w-[14%] bg-red-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                  Execution
                </p>
                <p className="mt-1 text-sm font-semibold">78%</p>
              </div>
              <div className="rounded-xl border border-[color:color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-surface p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                  Resilience
                </p>
                <p className="mt-1 text-sm font-semibold">Rising ↑</p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-2xl border border-[color:color-mix(in_srgb,var(--color-border)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--color-surface-elevated)_85%,transparent)] p-4 shadow-xl backdrop-blur-lg md:block">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
              <LockClosedIcon className="h-4 w-4 text-[color:var(--color-primary)]" />
              Private
            </div>
            <p className="text-xs text-[color:var(--color-text-secondary)]">
              Encrypted at rest. Never used to train AI models.
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
            Most journaling apps store your thoughts. This one understands
            them.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Mood trackers tell you how you felt. {BRAND_NAME} tells you why —
            and shows you the receipts from your own writing.
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

      <section id="ask" className="bg-surface/70 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Ask your journal anything
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
              The AI coach searches your actual entries, goals, and weekly
              insights — then answers with evidence, not platitudes.
            </p>
          </div>
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {askExamples.map((question) => (
              <span
                key={question}
                className="rounded-full border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-background px-5 py-2.5 text-sm font-medium text-[color:var(--color-text-secondary)]"
              >
                "{question}"
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[color:color-mix(in_srgb,var(--color-primary)_30%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_8%,var(--color-surface-elevated)))] p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--color-secondary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--color-secondary)_16%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-secondary-dark)] dark:text-[color:var(--color-secondary-light)]">
              <SparklesIcon className="h-4 w-4" />
              Free — No Login Required
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Try it first. No account needed.
            </h2>
            <p className="mx-auto mt-4 text-[color:var(--color-text-secondary)]">
              Paste anything you've written and get a free AI personality
              read — the same evidence-backed analysis engine behind{" "}
              {BRAND_NAME}, in a single free tool.
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-lg flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/tools/personality-from-writing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[color:color-mix(in_srgb,var(--color-primary)_35%,transparent)] transition hover:scale-[1.02] sm:w-auto"
            >
              Get My Free Personality Read
              <SparklesIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color:var(--color-border)] px-7 py-3.5 text-sm font-semibold transition hover:bg-surface sm:w-auto"
            >
              See All Free Tools
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="tools"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Your complete self-knowledge toolkit
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            One app to journal, plan, track goals, and understand how you
            actually operate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: ChartBarIcon,
              label: "Behavioral Dashboard",
              description:
                "Your weekly behavioral profile: mindset distribution, execution ratio, resilience, procrastination and burnout signals — each backed by quotes from your entries.",
              badge: "The Mirror",
            },
            {
              icon: ChatBubbleBottomCenterTextIcon,
              label: "AI Coach Chat",
              description:
                "A coach with memory. It knows your journal history, spots what you're avoiding, and can even create goals for you right from the conversation.",
              badge: "AI Coach",
            },
            {
              icon: MicrophoneIcon,
              label: "Voice Journaling",
              description:
                "Record your thoughts out loud and get accurate automatic transcription — perfect for commutes, walks, and days when typing feels like work.",
              badge: "Voice",
            },
            {
              icon: CheckCircleIcon,
              label: "Goal Tracker",
              description:
                "Set goals, let AI break them into milestones, and watch your daily reflections connect to long-term progress automatically.",
              badge: "Growth",
            },
            {
              icon: CalendarDaysIcon,
              label: "Smart Planner",
              description:
                "A task planner with calendar and list views, tied to your goals — see your productivity next to your emotional state.",
              badge: "Productivity",
            },
            {
              icon: DocumentTextIcon,
              label: "Journal Templates",
              description:
                "Guided templates for gratitude, CBT reflection, anxiety, morning pages, and goal reviews — plus AI-generated custom templates.",
              badge: "Templates",
            },
          ].map(({ icon: Icon, label, description, badge }) => (
            <article
              key={label}
              className="flex flex-col gap-4 rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-6 transition duration-200 hover:border-[color:var(--color-primary)]/50 hover:shadow-xl sm:p-7"
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
      </section>

      <section id="how-it-works" className="bg-surface/70 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              From raw thoughts to self-knowledge in three steps
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
              You just write (or talk). The analysis happens on its own — and
              compounds the longer you journal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                count: "01",
                title: "Write or speak freely",
                description:
                  "Use the distraction-free editor, a guided template, or voice recording. No rigid formats — your thoughts, your way.",
              },
              {
                count: "02",
                title: "AI builds your behavioral profile",
                description:
                  "Every entry is analyzed for mood, energy, and signals. Weekly, the engine detects patterns across entries — mindset, procrastination, burnout, resilience — and collects the evidence.",
              },
              {
                count: "03",
                title: "See yourself clearly, then act",
                description:
                  "Review your dashboard, question your AI coach, and turn recurring patterns into concrete goals — tracked in the same app.",
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
        id="pricing"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Simple pricing, free to start
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Begin for free. Upgrade when you want the full mirror. Yearly
            billing gets you 2 months free.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`flex h-full flex-col rounded-3xl border p-7 ${
                tier.highlighted
                  ? "border-[color:var(--color-primary)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface-elevated)),color-mix(in_srgb,var(--color-secondary)_6%,var(--color-surface-elevated)))] shadow-xl"
                  : "border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight">
                  {tier.name}
                </h3>
                {tier.highlighted && (
                  <span className="rounded-full bg-[color:var(--color-primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mb-1 text-4xl font-black tracking-tight">
                {tier.price}
                <span className="text-sm font-medium text-[color:var(--color-text-tertiary)]">
                  {" "}
                  {tier.period}
                </span>
              </p>
              <p className="mb-6 text-sm text-[color:var(--color-text-secondary)]">
                {tier.description}
              </p>
              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-[color:var(--color-text-secondary)]"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-primary)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition ${
                  tier.highlighted
                    ? "bg-gradient-to-br from-[color:var(--color-primary-dark)] to-[color:var(--color-primary)] text-white shadow-lg hover:scale-[1.02]"
                    : "border border-[color:var(--color-border)] hover:bg-background"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[color:var(--color-text-secondary)]">
          Full comparison, yearly rates, and regional payment options on the{" "}
          <Link
            href="/pricing"
            className="font-semibold text-[color:var(--color-primary)] hover:underline"
          >
            pricing page
          </Link>
          .
        </p>
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
                  Everyone has behavioral patterns they can't see from the
                  inside — the procrastination triggers, the burnout warning
                  signs, the conditions where they do their best work.{" "}
                  {BRAND_NAME} exists to make those patterns visible, with
                  evidence, so self-improvement stops being guesswork.
                </p>
              </div>

              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Privacy First
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  Your journal is your safe space. Entries are encrypted at
                  rest and stored in isolated per-user spaces. We never sell
                  your data and never use your writing to train AI models. You
                  can export everything or delete your account — and all your
                  data with it — at any time.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-surface p-8">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  Why We Built This
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  Journaling apps store your thoughts and mood trackers chart
                  your feelings, but neither answers the question that
                  actually matters: <em>why do I keep doing this?</em> We
                  built the behavioral intelligence engine we wanted for
                  ourselves — one that reads across weeks of entries, finds
                  the patterns, and backs every claim with your own words.
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
                  Early Access
                </h3>
                <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
                  {BRAND_NAME} is newly launched and founder-led, which means
                  your feedback lands directly with the person building the
                  product. Early users get a generous free tier, fast support,
                  and a real say in the roadmap.
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
              <h4 className="mb-3 font-semibold">Founder-Direct Support</h4>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                We typically respond within 24 hours. Your feedback goes
                straight to the person building the product and directly
                shapes the roadmap, so we genuinely appreciate hearing from
                you.
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
            Everything you need to know about {BRAND_NAME}.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {[
            {
              q: "How is this different from other AI journaling apps?",
              a: "Most AI journaling apps give you a sentiment score or a generic reflection after each entry. AIGoalReflect analyzes across weeks of entries to build a behavioral profile — mindset trends, procrastination triggers, burnout signals, resilience — and backs every detected pattern with direct quotes from your own writing. You get evidence, not vibes.",
            },
            {
              q: "Is AIGoalReflect free to use?",
              a: "There's a free tier with no time limit: 10 journal entries per month, 3 active goals, weekly insights, and guided templates — no credit card required. The Reflect ($9.99/mo) and Thrive ($19.99/mo) plans unlock the AI coach chat, deeper behavioral analysis, voice journaling, and higher limits. Yearly billing includes 2 months free.",
            },
            {
              q: "Is my journal private and secure?",
              a: "Yes. Your entries are encrypted at rest and stored in isolated per-user spaces. We never sell your data and never use your writing to train AI models. You can export all your data or permanently delete your account at any time.",
            },
            {
              q: "How does the behavioral pattern detection work?",
              a: "As you journal, AI analyzes each entry for mood, energy, and behavioral signals. Every week, an intelligence engine looks across your recent entries to detect larger patterns — growth vs. fixed mindset, action vs. avoidance, procrastination, burnout risk, resilience — and attaches the specific journal excerpts that support each finding.",
            },
            {
              q: "Can I journal with my voice?",
              a: "Yes. On the Thrive plan you can record entries out loud and they're automatically transcribed to text, then analyzed exactly like a written entry — great for commutes, walks, or days when typing feels like too much.",
            },
            {
              q: "Can I use it for mental wellness journaling?",
              a: "Yes. AIGoalReflect supports mental wellness through structured self-reflection, mood and energy tracking, and CBT-inspired journaling templates for anxiety, gratitude, and stress. It's a self-knowledge tool, not a medical device — it doesn't replace professional mental health care.",
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
            What would your journal say about you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[color:var(--color-text-secondary)]">
            Start writing today. Your first patterns start surfacing within a
            week — with the evidence to prove them.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-8 py-4 text-base font-semibold text-white transition hover:brightness-110 sm:w-auto"
            >
              Start Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center rounded-xl border border-[color:var(--color-border)] px-8 py-4 text-base font-semibold transition hover:bg-surface sm:w-auto"
            >
              View Pricing
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
              © 2026 AIGoalReflect. Your journal, analyzed.
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              Village Puremohan, Rampur Gauri, Pratapgarh 230001, India
            </p>
          </div>
          <div className="flex items-center gap-6 text-[color:var(--color-text-secondary)]">
            <Link
              href="/pricing"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Pricing
            </Link>
            <Link
              href="/tools"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Free Tools
            </Link>
            <Link
              href="/blog"
              className="transition hover:text-[color:var(--color-primary)]"
            >
              Blog
            </Link>
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
              href="#contact"
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
