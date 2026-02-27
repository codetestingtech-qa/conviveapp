module.exports = {
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "https://conviveapp.lovable.app/assets/:path*",
      },
    ];
  },
};