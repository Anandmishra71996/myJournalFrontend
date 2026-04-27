import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import InstallButton from "@/components/InstallButton";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PWARegister from "@/components/PWARegister";
import { AuthProvider } from "@/providers/AuthProvider";
import { BRAND_NAME, BRAND_DESCRIPTION } from "@/constants/brand.constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${BRAND_NAME} - AI-Powered Personal Journal`,
  description: BRAND_DESCRIPTION,
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  applicationName: BRAND_NAME,
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
    url: "https://yourdomain.com",
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: `${BRAND_NAME} Icon`,
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
        <meta name="apple-mobile-web-app-title" content="AIGoalReflect" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
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
