import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import InstallButton from "@/components/InstallButton";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWARegister from "@/components/PWARegister";
import { AuthProvider } from "@/providers/AuthProvider";
import {
  BRAND_NAME,
  BRAND_DESCRIPTION,
  SITE_URL,
} from "@/constants/brand.constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — Free AI Journal App for Mental Wellness & Self-Growth`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    "AI journal app",
    "AI journaling",
    "AI personal journal",
    "free journaling app",
    "mental wellness app",
    "AI life insights",
    "weekly AI insights",
    "AI planner app",
    "smart task planner",
    "goal tracker app",
    "personal goal tracker",
    "AI companion chat",
    "journal templates",
    "gratitude journal template",
    "CBT journal template",
    "digital journal",
    "mood tracking app",
    "emotional intelligence journal",
    "mindfulness journal",
    "self-reflection app",
    "journaling for mental health",
    "private AI journal",
    "journal with AI insights",
    "personal growth journal",
    "journaling app for anxiety",
    "daily journal app",
    "journal prompts AI",
    "CBT journaling app",
    "online journal private",
    "habit tracker journal",
    "self-improvement app",
    "mental health tracker",
    "journaling app free",
    "AI-powered self-care",
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
    title: `${BRAND_NAME} — Free AI Journal App for Mental Wellness & Self-Growth`,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: `${BRAND_NAME} — AI Journaling App`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Free AI Journal App for Mental Wellness`,
    description:
      "Track mood, spot emotional patterns, and gain personal growth insights with AI. Private, encrypted, free to use.",
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
        "AI-powered journaling insights",
        "AI life insights — weekly patterns and mood analysis",
        "Smart planner with calendar and task management",
        "Goal tracker linked to journal reflections",
        "AI companion chat for conversational journaling",
        "Guided journal templates (gratitude, CBT, morning pages)",
        "Mood tracking and emotional pattern analysis",
        "Private end-to-end encrypted journal entries",
        "Daily AI journaling prompts",
        "Mental wellness tracking dashboard",
        "Personal growth analytics",
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
            text: "Yes, AIGoalReflect is completely free during our open beta. All features including AI insights, mood tracking, and encrypted journaling are available at no cost.",
          },
        },
        {
          "@type": "Question",
          name: "Is my journal private and secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Absolutely. All journal entries are end-to-end encrypted. We never sell your data or train public AI models on your writing.",
          },
        },
        {
          "@type": "Question",
          name: "How does the AI journaling feature work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our AI analyzes your journal entries to identify emotional patterns, mood trends, and recurring themes. It generates personalized insights and smart prompts to help you reflect more deeply.",
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
        <ThemeProvider>
          <AuthProvider>
            <PWARegister />
            {children}
            <InstallButton />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
