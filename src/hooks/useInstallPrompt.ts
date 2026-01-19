import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== "undefined") {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInApp);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent default mini-infobar
      e.preventDefault();

      // Store the event for later use
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPromptEvent(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPromptEvent(null);
    };

    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsInstallable(false);
  };

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }

    // Show the install prompt
    await installPromptEvent.prompt();

    // Wait for the user's response
    const choiceResult = await installPromptEvent.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      setIsInstallable(false);
      setInstallPromptEvent(null);
    } else {
      console.log("User dismissed the install prompt");
    }
  };

  return {
    installPromptEvent,
    isInstallable: isInstallable && !isDismissed,
    isInstalled,
    handleInstallClick,
    handleDismiss,
  };
}
