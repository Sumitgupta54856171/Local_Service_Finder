import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy API calls to Django backend so the browser makes same-origin requests (no CORS).
      { source: "/api-backend/:path*", destination: "http://localhost:8000/:path*" },
    ];
  },
  webpack(config, { dev }) {
    // Reduce watched files to avoid EMFILE (too many open files) on limited systems.
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.next/**",
          "**/.git/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
