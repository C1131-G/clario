import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  cacheLife: {
    brief: { expire: 300, revalidate: 60, stale: 30 },
    moderate: { expire: 86_400, revalidate: 3600, stale: 300 },
    realtime: { expire: 30, revalidate: 10, stale: 0 },
    reference: { expire: 604_800, revalidate: 86_400, stale: 3600 },
  },
  experimental: {
    exposeTestingApiInProductionBuild: process.env.EXPOSE_TESTING_API === "1",
    /**
     * Inline critical CSS into the HTML response for faster first paint
     * (next-beats / Next 16 Instant Navigations pattern).
     */
    inlineCss: true,
    /**
     * Surface instant-navigation validation issues during development.
     */
    instantInsights: {
      validationLevel: "warning",
    },
    /**
     * Tree-shake barrel imports from icon packages per cold start.
     */
    optimizePackageImports: ["@phosphor-icons/react"],
    serverActions: {
      bodySizeLimit: "6mb",
    },
    /**
     * Use Next's native Rust React Compiler integration with Turbopack.
     */
    turbopackRustReactCompiler: true,
    /**
     * Run the project-local TypeScript CLI during Next builds.
     */
    useTypeScriptCli: true,
  },
  /**
   * Prefetch the App Shell for routes when Cache Components is enabled.
   */
  partialPrefetching: true,
  reactCompiler: true,
  /**
   * Statically type next/link href and next/navigation push/replace/prefetch
   * against the App Router route map (.next/types/routes.d.ts).
   * @see https://nextjs.org/docs/app/api-reference/config/typescript#statically-typed-links
   */
  typedRoutes: true,
};

export default withBundleAnalyzer(nextConfig);
