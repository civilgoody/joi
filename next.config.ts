import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com", // for the logo
      },
    ],
  },
};

export default nextConfig;
