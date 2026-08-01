import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import InstallButton from "@/components/InstallButton";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWARegister from "@/components/PWARegister";
import { AuthProvider } from "@/providers/AuthProvider";
import { PostHogProvider } from "@/providers/PostHogProvider";
import {
  BRAND_NAME,
  BRAND_DESCRIPTION,
  SITE_URL,
} from "@/constants/brand.constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Your Journal, Analyzed. AI Behavioral Pattern Detection`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    "AI journal app",
    "AI journaling",
    "AI journal analysis",
    "behavioral pattern detection",
    "behavioral self-tracking",
    "procrastination tracker",
    "growth mindset tracker",
    "burnout tracking app",
    "self-knowledge app",
    "AI life insights",
    "weekly AI insights",
    "voice journaling app",
    "AI journal coach",
    "AI companion chat",
    "goal tracker app",
    "personal goal tracker",
    "smart task planner",
    "journal templates",
    "gratitude journal template",
    "CBT journal template",
    "mood tracking app",
    "emotional intelligence journal",
    "self-reflection app",
    "journaling for mental health",
    "private AI journal",
    "journal with AI insights",
    "personal growth journal",
    "journaling app for anxiety",
    "daily journal app",
    "journal prompts AI",
    "self-improvement app",
    "productivity journal app",
    "AI goal setting app",
  ],
  authors: [{ name: "Anand Mishra", url: SITE_URL }],
  creator: "Anand Mishra",
  publisher: BRAND_NAME,
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  applicationName: BRAND_NAME,
  category: "health & fitness",
  classification: "Mental Wellness, Journaling, Self-Improvement",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "icon", url: "/favicon.png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: BRAND_NAME,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — Your Journal, Analyzed. AI Behavioral Pattern Detection`,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: `${BRAND_NAME} — AI Behavioral Pattern Detection from Your Journal`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Your Journal, Analyzed`,
    description:
      "AI that detects your behavioral patterns — procrastination triggers, mindset trends, burnout signals — with evidence from your own journal entries. Private and free to start.",
    images: ["/icons/icon-512x512.png"],
    creator: "@aigoalreflect",
  },
  alternates: {
    canonical: SITE_URL,
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: BRAND_NAME,
      url: SITE_URL,
      description: BRAND_DESCRIPTION,
      applicationCategory: "HealthApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Behavioral pattern detection with evidence from your own entries",
        "Weekly behavioral intelligence — mindset, procrastination, burnout, resilience",
        "AI coach chat grounded in your journal history",
        "Voice journaling with automatic transcription",
        "Goal tracker linked to journal reflections",
        "Smart planner with calendar and task management",
        "Guided journal templates (gratitude, CBT, morning pages)",
        "Mood tracking and emotional pattern analysis",
        "Private, encrypted journal entries — never used to train AI models",
      ],
      screenshot: `${SITE_URL}/icons/screenshot-540x720.png`,
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icons/icon-512x512.png`,
      email: "hello@aigoalreflect.online",
      foundingDate: "2026",
      founder: {
        "@type": "Person",
        name: "Anand Mishra",
        jobTitle: "Lead Full-Stack Engineer & AI Systems Architect",
        sameAs: "https://www.linkedin.com/in/anandmishraleaddeveloper",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pratapgarh",
        addressRegion: "Uttar Pradesh",
        postalCode: "230001",
        addressCountry: "IN",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is AIGoalReflect free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "There's a free tier with no time limit: 10 journal entries per month, 3 active goals, weekly insights, and guided templates — no credit card required. Reflect ($9.99/mo) and Thrive ($19.99/mo) plans unlock the AI coach chat, deeper behavioral analysis, voice journaling, and higher limits.",
          },
        },
        {
          "@type": "Question",
          name: "Is my journal private and secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Journal entries are encrypted at rest and stored in isolated per-user spaces. We never sell your data and never use your writing to train AI models. You can export or permanently delete all your data at any time.",
          },
        },
        {
          "@type": "Question",
          name: "How does behavioral pattern detection work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "As you journal, AI analyzes each entry for mood, energy, and behavioral signals. Every week an intelligence engine looks across your recent entries to detect larger patterns — growth vs. fixed mindset, procrastination, burnout risk, resilience — and attaches the specific journal excerpts that support each finding.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use AIGoalReflect for mental health journaling?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. AIGoalReflect is designed to support mental wellness through structured self-reflection, mood tracking, and CBT-inspired journaling prompts to help with anxiety, stress, and personal growth.",
          },
        },
        {
          "@type": "Question",
          name: "What are AI Life Insights?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI Life Insights are weekly AI-generated reports synthesized from your journal entries. They surface mood arcs, recurring stressors, energy patterns, and growth themes so you can make better personal decisions.",
          },
        },
        {
          "@type": "Question",
          name: "Does AIGoalReflect have a task planner?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Smart Planner lets you create and manage tasks in list or calendar view, set due dates, and link tasks to your personal goals. Your productivity data appears alongside your emotional insights for a complete self-growth picture.",
          },
        },
        {
          "@type": "Question",
          name: "Can I track personal goals in AIGoalReflect?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The Goal Tracker lets you set personal goals, break them into milestones, and see how your daily journal reflections connect to your long-term progress — all in one place.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={BRAND_NAME} />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <PostHogProvider>
          <ThemeProvider>
            <AuthProvider>
              <PWARegister />
              {children}
              <InstallButton />
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
