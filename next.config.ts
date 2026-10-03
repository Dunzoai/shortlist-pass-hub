import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/new",
        destination: "/",
        permanent: false,
      },
      {
        source: "/shorty",
        destination: "/smartpages",
        permanent: true,
      },
      {
        source: "/dining-pass",
        destination: "/localist",
        permanent: true,
      },
      {
        source: "/localpass",
        destination: "/localist",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
