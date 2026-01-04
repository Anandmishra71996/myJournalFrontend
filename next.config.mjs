import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  scope: "/",
  sw: "sw.js",
  customWorkerDir: "worker",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
