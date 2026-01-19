// Custom Service Worker code for Push Notifications
// This file is automatically merged with Workbox by @ducanh2912/next-pwa

// Listen for push events
self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    const {
      title = "Journaling App",
      body = "You have a new notification",
      icon = "/icons/icon-192x192.png",
      badge = "/icons/icon-192x192.png",
      url = "/",
      data: notificationData = {},
    } = data;

    const options = {
      body,
      icon,
      badge,
      data: {
        url,
        ...notificationData,
      },
      vibrate: [200, 100, 200],
      tag: "journal-notification",
      requireInteraction: false,
      actions: [
        {
          action: "open",
          title: "Open App",
        },
        {
          action: "close",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    // Silent fail
  }
});

// Listen for notification click events
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with our app
        for (const client of clientList) {
          if (
            client.url === new URL(urlToOpen, self.location.origin).href &&
            "focus" in client
          ) {
            return client.focus();
          }
        }

        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Listen for notification close events
self.addEventListener("notificationclose", (event) => {
  // Track notification dismissals if needed
});

// Backend API URL - injected at build time from environment variable
// On Vercel, set NEXT_PUBLIC_API_URL in environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Handle push subscription changes
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    // Try to resubscribe
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          event.oldSubscription?.options?.applicationServerKey,
      })
      .then((newSubscription) => {
        // Send the new subscription to your backend
        return fetch(`${API_BASE_URL}/push/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubscription.toJSON()),
        });
      })
      .catch((error) => {
        // Silent fail
      })
  );
});
