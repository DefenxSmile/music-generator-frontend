import type { NextConfig } from "next";
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const githubPages = process.env.GITHUB_PAGES === "1";
const pagesBase = process.env.GITHUB_PAGES_BASE ?? "";

const nextConfig: NextConfig = {
  output: githubPages ? "export" : "standalone",
  env: {
    JAVA_API_BASE_URL: process.env.JAVA_API_BASE_URL ?? "",
  },
  ...(githubPages
    ? {
        basePath: pagesBase,
        assetPrefix: pagesBase,
        trailingSlash: true,
      }
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;
