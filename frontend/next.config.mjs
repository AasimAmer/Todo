/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy all /api/strapi/* requests to Strapi on port 1337.
  // This eliminates CORS issues because the browser always talks to
  // the same origin (localhost:3000), and Next.js forwards server-side.
  async rewrites() {
    return [
      {
        source: '/api/strapi/:path*',
        destination: 'http://localhost:1337/api/:path*',
      },
    ];
  },
};

export default nextConfig;
