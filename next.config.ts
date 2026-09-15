import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Metadata only reads local data and environment values. Resolve it before
  // emitting <head> for every client, including Naver's HTML verification.
  htmlLimitedBots: /.*/,
  async redirects() {
    return [{ source: '/:path*', has: [{ type: 'host' as const, value: 'www\\.on-onf\\.com' }], destination: 'https://on-onf.com/:path*', permanent: true }];
  },
  async headers() {
    return [{ source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default nextConfig;
