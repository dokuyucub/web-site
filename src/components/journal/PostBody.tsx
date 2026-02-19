import { PortableText } from "@/components/ui/PortableText";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface PostBodyProps {
  title: string;
  publishedAt: string;
  body: unknown[];
  locale: string;
}

export async function PostBody({ title, publishedAt, body, locale }: PostBodyProps) {
  const t = await getTranslations("journal");
  const readingTime = estimateReadingTime(body);

  return (
    <article className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6 text-sz-small opacity-40 tracking-wide">
          <time dateTime={publishedAt}>
            {formatDate(publishedAt, locale === "tr" ? "tr-TR" : "en-US")}
          </time>
          <span>·</span>
          <span>{t("readingTime", { minutes: readingTime })}</span>
        </div>
        <h1 className="text-display font-medium tracking-tight">{title}</h1>
      </header>

      {/* Scroll progress indicator */}
      <div
        className="fixed top-0 left-0 h-0.5 z-50 origin-left"
        style={{ backgroundColor: "var(--color-fg)" }}
        id="scroll-progress"
      />

      {/* Body */}
      <PortableText value={body} className="prose-custom" />
    </article>
  );
}
