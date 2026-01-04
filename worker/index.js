// Custom Service Worker code for Push Notifications
// This file extends the auto-generated service worker from next-pwa

// Listen for push events
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  if (!event.data) {
    console.warn("Push event has no data");
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
    console.error("Error handling push event:", error);
  }
});

// Listen for notification click events
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

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

// Listen for notification close events (optional)
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event);
  // You can track notification dismissals here if needed
});

// Handle push subscription changes
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("Push subscription changed:", event);

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
        return fetch("/api/push/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubscription.toJSON()),
        });
      })
      .catch((error) => {
        console.error("Failed to resubscribe:", error);
      })
  );
});
