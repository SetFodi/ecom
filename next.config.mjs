// next.config.mjs
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig; // Use ESM export syntax