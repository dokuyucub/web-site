import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
}

interface PostListProps {
  posts: Post[];
  locale: string;
}

export async function PostList({ posts, locale }: PostListProps) {
  const t = await getTranslations("journal");

  if (!posts || posts.length === 0) {
    return (
      <div className="py-20 text-center opacity-40">
        <p className="text-sz-small tracking-widest uppercase">Henüz yazı yok</p>
      </div>
    );
  }

  return (
    <ul className="divide-y" style={{ borderColor: "var(--color-border)" }}>
      {posts.map((post) => (
        <li key={post._id}>
          <Link
            href={{ pathname: "/journal/[slug]", params: { slug: post.slug.current } }}
            className="group flex items-start justify-between gap-8 py-8 transition-opacity hover:opacity-70"
          >
            <div>
              <h2 className="text-heading font-medium tracking-tight mb-3 group-hover:opacity-80 transition-opacity">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="opacity-50 leading-relaxed max-w-xl">{post.excerpt}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <time
                dateTime={post.publishedAt}
                className="text-sz-small opacity-40 tracking-wide"
              >
                {formatDate(post.publishedAt, locale === "tr" ? "tr-TR" : "en-US")}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
