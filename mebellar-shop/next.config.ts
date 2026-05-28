import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const nextConfig: NextConfig = {
  /** Tunnel orqali telefondan dev ochish */
  allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt"],
  async redirects() {
    return [{ source: "/catalog", destination: "/katalog", permanent: true }];
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://127.0.0.1:3000/uploads/:path*",
      },
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
