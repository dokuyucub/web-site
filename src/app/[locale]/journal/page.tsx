import { getPosts, getSettings } from "@sanity/lib/queries";
import { PostList } from "@/components/journal/PostList";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Journal",
    alternates: { canonical: `/${locale}/journal` },
  };
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-fg)" }}
    >
      {/* Back to canvas */}
      <div className="fixed top-6 left-6 z-30">
        <Link
          href="/"
          className="text-sz-small tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
        >
          ← {settings?.siteTitle ?? "Portfolio"}
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <h1 className="text-display font-medium tracking-tight mb-12">Journal</h1>
        <PostList posts={posts ?? []} locale={locale} />
      </main>
    </div>
  );
}
