/**@type {import('next').NextConfig}*/

const nextConfig = {

  // Webpack configuration for performance
  webpack: (config, { isServer }) => {
    // Split chunks for better performance
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 5,
      minSize: 30000,
      maxSize: 350000, // Larger maxSize for reduced HTTP requests
    }
    // Exclude server-specific modules for the client
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    } return config;
  },

  // Image optimization
  images: {
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'], // Enable modern formats
    domains: ['http://localhost:3000'], // Add your trusted domains here
  },

  // Compression for faster load times
  compress: true,

  // Custom headers for improved security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Enable faster builds and reduced runtime overhead
  output: 'standalone',
 
};

module.exports = nextConfig;
