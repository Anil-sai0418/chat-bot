import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'chat-bot-schu.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
