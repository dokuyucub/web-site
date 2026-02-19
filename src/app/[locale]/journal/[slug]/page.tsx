import { getPostBySlug, postSlugsQuery, getSettings } from "@sanity/lib/queries";
import { sanityClient } from "@sanity/lib/client";
import { PostBody } from "@/components/journal/PostBody";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { urlFor } from "@sanity/lib/image";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(postSlugsQuery).catch(() => [] as string[]);
  const locales = ["tr", "en"];
  return locales.flatMap((locale) =>
    (slugs ?? []).map((slug: string) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImageUrl = post.seo?.ogImage
    ? urlFor(post.seo.ogImage).width(1200).height(630).url()
    : post.coverImage?.url;

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    openGraph: {
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);

  if (!post) notFound();

  return (
    <div
      className="min-h-screen scrollable"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-fg)", cursor: "auto" }}
    >
      {/* Back to journal */}
      <div className="fixed top-6 left-6 z-30">
        <Link
          href="/journal"
          className="text-sz-small tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
        >
          ← Journal
        </Link>
      </div>

      <main className="px-6 pt-20 pb-24">
        <PostBody
          title={post.title}
          publishedAt={post.publishedAt}
          body={post.body ?? []}
          locale={locale}
        />
      </main>
    </div>
  );
}
