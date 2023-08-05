/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/pin-my-map/image/upload/**',
      },
    ],
  },
};

module.exports = nextConfig;
