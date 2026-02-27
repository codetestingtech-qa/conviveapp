/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "https://conviveapp.com.br/assets/:path*",
      },
    ];
  },
};

module.exports = nextConfig;