import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ lastModified: new Date(), url: "http://localhost:3000" }];
}
