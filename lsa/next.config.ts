import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy API calls to Django backend so the browser makes same-origin requests (no CORS).
      { source: "/api-backend/:path*", destination: "http://localhost:8000/:path*" },
    ];
  },
};

export default nextConfig;
