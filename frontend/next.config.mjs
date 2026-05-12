/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/strapi/:path*',
        destination: `${process.env.STRAPI_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;