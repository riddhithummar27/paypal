import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.paypal.com https://*.paypal.com https://*.paypalobjects.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.unsplash.com https://images.unsplash.com https://api.dicebear.com https://*.paypal.com https://*.paypalobjects.com https://*.tile.openstreetmap.org",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://api-m.sandbox.paypal.com https://www.sandbox.paypal.com https://*.paypal.com https://*.supabase.co wss://*.supabase.co",
              "frame-src 'self' https://www.sandbox.paypal.com https://*.paypal.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
