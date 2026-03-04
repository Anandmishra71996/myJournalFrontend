"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, BeakerIcon } from "@heroicons/react/24/outline";

export default function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if beta mode is enabled
    const betaMode = process.env.NEXT_PUBLIC_BETA_MODE === 'true';
    if (!betaMode) {
      return;
    }

    // Check if banner was dismissed
    const dismissed = localStorage.getItem('beta-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('beta-banner-dismissed', 'true');
    setIsVisible(false);
  };

  // Don't render on server or if dismissed
  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <BeakerIcon className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm md:text-base font-medium">
            <span className="font-bold">Beta Testing Mode</span>
            <span className="hidden sm:inline"> — You're helping us build something amazing! </span>
            <a
              href="mailto:anandmishra71996@gmail.com"
              className="underline hover:text-blue-200 ml-1"
            >
              Report issues
            </a>
          </p>
        </div>
        
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Dismiss banner"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
