import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/products", destination: `${apiUrl}/api/products` },
      { source: "/api/products/:path*", destination: `${apiUrl}/api/products/:path*` },
      { source: "/api/categories", destination: `${apiUrl}/api/categories` },
      { source: "/api/health/db", destination: `${apiUrl}/api/health/db` },
    ];
  },
  /** Alohida loyiha — parent MMebellar lockfile bilan aralashmasin */
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    qualities: [70, 75],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
