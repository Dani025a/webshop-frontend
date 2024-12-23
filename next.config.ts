import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/dgelectronics-product-images/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allows all hostnames
      },
    ],
  },
}

export default nextConfig

