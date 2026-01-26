'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SparklesIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon,
  HeartIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';

const quotes = [
  {
    text: "Journaling is like whispering to one's self and listening at the same time.",
    author: "Mina Murray"
  },
  {
    text: "Fill your paper with the breathings of your heart.",
    author: "William Wordsworth"
  },
  {
    text: "Journal writing is a voyage to the interior.",
    author: "Christina Baldwin"
  },
  {
    text: "Writing in a journal reminds you of your goals and of your learning in life.",
    author: "Robin Sharma"
  },
  {
    text: "Keeping a journal will absolutely change your life in ways you've never imagined.",
    author: "Oprah Winfrey"
  },
  {
    text: "The life of every man is a diary in which he means to write one story, and writes another.",
    author: "J.M. Barrie"
  }
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/journal');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentQuote]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="p-6 md:p-8 sticky top-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Journal Logo" className="w-10 h-10 md:w-12 md:h-12" />
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

      {/* Hero Section with Quote Slider */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Quote Slider */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-16 min-h-[300px] flex flex-col justify-center">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <blockquote className="text-center">
                  <p className="text-2xl md:text-4xl font-serif text-gray-900 mb-8 leading-relaxed">
                    "{quotes[currentQuote].text}"
                  </p>
                  <cite className="text-lg md:text-xl text-gray-700 font-medium not-italic">
                    — {quotes[currentQuote].author}
                  </cite>
                </blockquote>
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous quote"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {quotes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuote(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentQuote
                          ? 'w-8 bg-primary'
                          : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to quote ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Next quote"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Begin Your Journey
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Document your thoughts, track your growth, and discover insights with our AI-powered journaling companion.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Your First Entry
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Journal Better
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              More than just a digital notebook. Experience intelligent journaling that grows with you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Insights</h3>
              <p className="text-gray-700 leading-relaxed">
                Get personalized insights from your entries. Our AI analyzes patterns in your thoughts, emotions, and experiences to help you understand yourself better.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Conversational Journaling</h3>
              <p className="text-gray-700 leading-relaxed">
                Chat with an AI companion that asks thoughtful questions, helping you explore your thoughts more deeply than traditional journaling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center mb-6">
                <LightBulbIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Prompts</h3>
              <p className="text-gray-700 leading-relaxed">
                Never stare at a blank page again. Get intelligent writing prompts tailored to your mood, goals, and journaling history.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growth Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                Visualize your emotional journey over time. Track mood patterns, achievements, and personal development with beautiful analytics.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Goal Integration</h3>
              <p className="text-gray-700 leading-relaxed">
                Set meaningful goals and track progress seamlessly. Your journal becomes a powerful tool for achieving what matters most.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-6">
                <LockClosedIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Private & Secure</h3>
              <p className="text-gray-700 leading-relaxed">
                Your thoughts are yours alone. Enterprise-grade encryption keeps your entries completely private and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Smarter Way to Journal
            </h2>
            <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto">
              We've reimagined journaling for the modern age, combining timeless practices with cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <BoltIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Instant Feedback</h3>
              <p className="text-indigo-100 leading-relaxed">
                Get immediate AI-generated reflections and insights after each entry. No waiting for weekly summaries or manual analysis.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Truly Intelligent</h3>
              <p className="text-indigo-100 leading-relaxed">
                Our AI doesn't just store your entries—it understands context, remembers past conversations, and evolves with your journey.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Built for You</h3>
              <p className="text-indigo-100 leading-relaxed">
                No ads, no distractions, no selling your data. Just a pure, focused experience designed for your personal growth.
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
              Simple. Powerful. Transformative.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Start journaling in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Write Freely</h3>
              <p className="text-gray-700">
                Use our traditional journal or chat with our AI companion. Express yourself however feels natural.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Insights</h3>
              <p className="text-gray-700">
                Receive personalized reflections, pattern analysis, and thoughtful questions to deepen your understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Growth</h3>
              <p className="text-gray-700">
                Watch your progress over time, achieve your goals, and become the best version of yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Journaling?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            Join thousands who have discovered a better way to reflect, grow, and thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Start Free Today
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="text-gray-600 text-sm">No credit card required • 100% free to start</p>
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