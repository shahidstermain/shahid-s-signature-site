/**
 * Next.js Configuration for SEO-Optimized Static Export
 * 
 * This configuration is optimized for:
 * - Static export to Firebase Hosting
 * - SEO-friendly URLs and redirects
 * - Image optimization
 * - Security headers
 * - Performance optimization
 * 
 * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Firebase Hosting
  output: 'export',
  
  // No trailing slashes (cleaner URLs, consistent canonicals)
  trailingSlash: false,
  
  // Image optimization (unoptimized required for static export)
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Strict mode for development
  reactStrictMode: true,

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Compression (handled by Firebase Hosting CDN)
  compress: true,

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://shahidster.tech',
  },

  // SEO-friendly redirects
  async redirects() {
    return [
      // Redirect legacy URLs
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // Blog URL variations
      {
        source: '/articles/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/posts/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/writing/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      // Feed redirects
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/rss.xml',
        permanent: true,
      },
      // Resume/CV
      {
        source: '/resume',
        destination: '/resume.pdf',
        permanent: true,
      },
      {
        source: '/cv',
        destination: '/resume.pdf',
        permanent: true,
      },
    ];
  },

  // Security and caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache JS/CSS with immutable (hashed filenames)
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Don't cache HTML pages (ensure fresh content)
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'Accept',
            value: '(.*text/html.*)',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // Webpack configuration for optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Split vendor chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  // Experimental features (optional)
  experimental: {
    // Optimize package imports for better tree-shaking
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;

/**
 * Alternative Configuration for SSR with Firebase Cloud Functions
 * 
 * If you need server-side rendering, use this configuration instead:
 * 
 * const nextConfig = {
 *   // Remove 'output: export' for SSR
 *   images: {
 *     remotePatterns: [
 *       {
 *         protocol: 'https',
 *         hostname: 'shahidster.tech',
 *       },
 *     ],
 *   },
 *   // ... rest of config
 * };
 * 
 * Then deploy with:
 * - Firebase Cloud Functions for SSR
 * - Firebase Hosting for static assets
 */
