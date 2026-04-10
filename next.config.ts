import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only define remote patterns for images actually used in production
    // (lh3.googleusercontent.com was only used in deleted placeholder components)
    remotePatterns: [],
    // Prefer modern formats for better compression
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // Tree-shake icon and chart libraries to only bundle used exports
    optimizePackageImports: ["lucide-react", "recharts"],
  },

  // Security headers on every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
