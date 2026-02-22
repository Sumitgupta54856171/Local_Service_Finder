import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Sabhi /api-backend/ wali requests ko pakdo
        source: "/api-backend/:path*",
        // Aur unhe Django (127.0.0.1) par bhej do
        destination: "http://localhost:8000/:path*",
      },
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
