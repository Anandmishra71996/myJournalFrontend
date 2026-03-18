"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  HeartIcon,
  LockClosedIcon,
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="p-6 md:p-8 sticky top-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Journal Logo"
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Journal
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Turn your daily thoughts into clear insights with AI
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                Write freely. Our AI analyzes your thoughts, patterns, and
                emotions to help you understand yourself better.
              </p>

              {/* Primary CTA */}
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105 mb-4"
              >
                Start Journaling with AI (Free Beta)
                <SparklesIcon className="w-5 h-5 ml-2" />
              </Link>

              {/* Trust Line */}
              <p className="text-gray-600 text-sm flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4" />
                No credit card required • Your data stays private
              </p>
            </div>

            {/* Product Preview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "Today I felt overwhelmed with work deadlines..."
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-xs leading-relaxed">
                    AI Insight: You've mentioned feeling overwhelmed 3 times
                    this week. Let's explore what's really causing this
                    stress...
                  </p>
                </div>
              </div>
              <p className="text-center text-gray-500 text-xs">
                Live AI analysis as you write
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Journaling is powerful — but hard to stick with
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="p-6">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-lg text-gray-700 font-medium">
                Don't know what to write?
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-lg text-gray-700 font-medium">
                Start journaling, quit after a few days?
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-lg text-gray-700 font-medium">
                Can't see real progress or insights?
              </p>
            </div>
          </div>

          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            That's where AI changes everything.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              AI-powered features that actually help
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Not just another digital notebook — intelligent tools designed to
              help you think deeper
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-Powered Insights
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Understand <strong>why</strong> you feel the way you do — not
                just what you write. Get real clarity on your emotions and
                patterns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Conversational Journaling
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Never feel stuck — AI guides your thoughts like a real
                conversation. No more blank page anxiety.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <LightBulbIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Prompts
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Always know what to write, even on your worst days. Get prompts
                that adapt to your mood and history.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Growth Tracking
              </h3>
              <p className="text-gray-700 leading-relaxed">
                See patterns in your emotions and track real personal growth.
                Finally understand what's working in your life.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Goal Integration
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Turn reflections into meaningful goals and progress. Your
                journal helps you actually achieve what matters.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-6">
                <LockClosedIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Private & Secure
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your thoughts are yours alone — fully private and encrypted. We
                never sell or share your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to better self-understanding
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Write freely
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                No structure needed. Just open the app and start writing
                whatever's on your mind.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                AI analyzes your thoughts
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our AI finds patterns in your emotions, identifies recurring
                themes, and connects the dots.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Get insights & track growth
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                See real progress over time. Understand yourself better with
                clear, actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Trusted by early users
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Used by early beta users building a daily journaling habit
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-sm text-gray-600">Beta User</p>
                </div>
              </div>
              <p className="text-gray-700 text-left italic">
                "Finally, a journal that helps me actually understand my
                feelings instead of just dumping them on a page. The AI insights
                are genuinely helpful."
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">James K.</p>
                  <p className="text-sm text-gray-600">Beta User</p>
                </div>
              </div>
              <p className="text-gray-700 text-left italic">
                "I've tried journaling apps before but always quit. The AI
                prompts keep me writing even when I don't know what to say."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <LockClosedIcon className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Your journal is private. Period.
            </h3>
            <p className="text-indigo-100 text-lg">
              We do not sell or use your data. Your thoughts are encrypted and
              belong only to you. No ads, no tracking, no exceptions.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Start your journaling habit with AI
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Free during beta. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-semibold rounded-full hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Get Early Access
              <SparklesIcon className="w-6 h-6 ml-2" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <LockClosedIcon className="w-5 h-5" />
              <span>Fully encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span>No credit card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartIcon className="w-5 h-5" />
              <span>Free beta access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 bg-white border-t border-gray-100">
        <p>© 2025 Journal. Reflect, Grow, Thrive.</p>
      </footer>
    </main>
  );
}
