
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The dev server logs a warning about cross-origin requests.
  // This is expected in a cloud development environment.
  devIndicators: {
    allowedDevOrigins: [
        '*.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
