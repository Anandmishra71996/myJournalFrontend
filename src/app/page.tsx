'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

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
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

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
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Journal
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSignup(true)}
              className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors font-medium"
            >
              Sign Up
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium"
            >
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogin(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginForm onSignupClick={() => {setShowLogin(false); setShowSignup(true); }} />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SignupForm onLoginClick={() => {setShowSignup(false); setShowLogin(true); }}/>
          </div>
        </div>
      )}

      {/* Hero Section with Quote Slider */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Quote Slider */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-16 min-h-[300px] flex flex-col justify-center">
              <div
                className={`transition-opacity duration-300 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <blockquote className="text-center">
                  <p className="text-2xl md:text-4xl font-serif text-text-primary mb-8 leading-relaxed">
                    "{quotes[currentQuote].text}"
                  </p>
                  <cite className="text-lg md:text-xl text-text-secondary font-medium not-italic">
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
                  <ChevronLeftIcon className="w-6 h-6 text-text-secondary" />
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
                  <ChevronRightIcon className="w-6 h-6 text-text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
              Begin Your Journey
            </h2>
            <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Document your thoughts, track your growth, and discover insights with our AI-powered journaling companion.
            </p>
            <button
              onClick={() => setShowSignup(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Your First Entry
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-text-secondary">
        <p>© 2025 Journal. Reflect, Grow, Thrive.</p>
      </footer>
    </main>
  );
}
