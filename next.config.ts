import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    brief: { expire: 300, revalidate: 60, stale: 30 },
    moderate: { expire: 86_400, revalidate: 3600, stale: 300 },
    realtime: { expire: 30, revalidate: 10, stale: 0 },
    reference: { expire: 604_800, revalidate: 86_400, stale: 3600 },
  },
  experimental: {
    /**
     * Inline critical CSS into the HTML response for faster first paint
     * (next-beats / Next 16 Instant Navigations pattern).
     */
    inlineCss: true,
    /**
     * Tree-shake barrel imports from icon packages per cold start.
     */
    optimizePackageImports: ["@phosphor-icons/react"],
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  /**
   * Statically type next/link href and next/navigation push/replace/prefetch
   * against the App Router route map (.next/types/routes.d.ts).
   * @see https://nextjs.org/docs/app/api-reference/config/typescript#statically-typed-links
   */
  typedRoutes: true,
};

export default withBundleAnalyzer(nextConfig);
