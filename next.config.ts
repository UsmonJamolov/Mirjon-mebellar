import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
