import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import InstallButton from "@/components/InstallButton";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWARegister from "@/components/PWARegister";
import PWADebug from "@/components/PWADebug";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Journaling App - AI-Powered Personal Journal",
  description: "Personal journaling app with AI-powered insights for better self-reflection",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  applicationName: "Journaling App",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Journal",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    title: "Journaling App",
    description: "Personal journaling app with AI-powered insights for better self-reflection",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Journaling App Icon",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
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
        <meta name="apple-mobile-web-app-title" content="Journal" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <PWARegister />
          <PWADebug />
          {children}
          <InstallButton />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
