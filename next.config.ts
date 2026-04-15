import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});


const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  images: {

    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "mbhnuhcjebqszvxcysvd.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    // remove after fix the build errors
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);

