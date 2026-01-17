import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-lostark.game.onstove.com",
        pathname: "/efui_iconatlas/**",
      },
      {
        protocol: "https",
        hostname: "cdn-lostark.game.onstove.com",
        pathname: "/uploadfiles/banner/**",
      },
    ],
  },
};

export default nextConfig;
