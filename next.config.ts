import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/shorty",
        destination: "/smartpages",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
