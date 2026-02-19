import { sanityClient } from "@sanity/lib/client";
import { projectSlugsQuery, postSlugsQuery } from "@sanity/lib/queries";
import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const locales = ["tr", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs] = await Promise.all([
    sanityClient.fetch<string[]>(projectSlugsQuery).catch(() => []),
    sanityClient.fetch<string[]>(postSlugsQuery).catch(() => []),
  ]);

  const staticRoutes = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  const postRoutes = (postSlugs ?? []).flatMap((slug: string) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/journal/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...postRoutes];
}
