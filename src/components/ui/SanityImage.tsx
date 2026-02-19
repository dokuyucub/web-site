import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image: SanityImageSource & {
    lqip?: string;
    dimensions?: { width: number; height: number };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function SanityImage({
  image,
  alt,
  width,
  height,
  fill,
  priority,
  className,
  sizes,
}: SanityImageProps) {
  const src = urlFor(image).auto("format").quality(85).url();
  const blurDataURL = image.lqip;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn("object-cover", className)}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      />
    );
  }

  const w = width ?? image.dimensions?.width ?? 1200;
  const h = height ?? image.dimensions?.height ?? 800;

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      className={className}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
    />
  );
}
