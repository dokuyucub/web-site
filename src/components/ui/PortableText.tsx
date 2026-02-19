import { PortableText as SanityPortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import type { PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      const src = urlFor(value).auto("format").quality(85).url();
      const lqip = value.asset?.metadata?.lqip;
      const layout = value.layout ?? "full";

      return (
        <figure
          className={`my-8 ${
            layout === "two-column" ? "grid grid-cols-2 gap-4" : ""
          }`}
        >
          <div className="relative overflow-hidden rounded-sm">
            <Image
              src={src}
              alt={value.caption ?? ""}
              width={1200}
              height={800}
              className="w-full h-auto"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sz-small opacity-50">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    videoEmbed: ({ value }) => {
      if (!value?.url) return null;
      let embedUrl = value.url;

      // Convert YouTube/Vimeo URLs to embed format
      if (embedUrl.includes("youtube.com/watch")) {
        const videoId = new URL(embedUrl).searchParams.get("v");
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (embedUrl.includes("youtu.be/")) {
        const videoId = embedUrl.split("youtu.be/")[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (embedUrl.includes("vimeo.com/")) {
        const videoId = embedUrl.split("vimeo.com/")[1];
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }

      return (
        <figure className="my-8">
          <div className="relative pt-[56.25%] overflow-hidden rounded-sm">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={value.caption ?? "Video"}
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sz-small opacity-50">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-heading font-medium mt-12 mb-4 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-medium mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-5 opacity-80 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 pl-6 my-8 opacity-70 italic text-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextProps {
  value: unknown[];
  className?: string;
}

export function PortableText({ value, className }: PortableTextProps) {
  if (!value) return null;
  return (
    <div className={className}>
      <SanityPortableText value={value as Parameters<typeof SanityPortableText>[0]["value"]} components={components} />
    </div>
  );
}
