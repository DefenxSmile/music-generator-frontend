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
const javaApiOrigin = (process.env.JAVA_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
/** Local/dev crutch: browser → same-origin `/api/v1` → Next rewrite → Java (avoids CORS). */
const javaApiProxy = !githubPages && process.env.JAVA_API_PROXY === "1" && Boolean(javaApiOrigin);

const nextConfig: NextConfig = {
  output: githubPages ? "export" : "standalone",
  env: {
    JAVA_API_BASE_URL: javaApiOrigin,
    NEXT_PUBLIC_JAVA_API_PROXY: javaApiProxy ? "1" : "",
  },
  ...(githubPages
    ? {
        basePath: pagesBase,
        assetPrefix: pagesBase,
        trailingSlash: true,
      }
    : {
        async rewrites() {
          if (!javaApiProxy) return [];
          return [
            {
              source: "/api/v1/:path*",
              destination: `${javaApiOrigin}/api/v1/:path*`,
            },
          ];
        },
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
