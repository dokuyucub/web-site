import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale: string = "tr-TR"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadingTime(body: unknown[]): number {
  if (!body) return 1;
  const text = body
    .filter((b: unknown) => (b as { _type: string })._type === "block")
    .map((b: unknown) =>
      ((b as { children: { text: string }[] }).children ?? [])
        .map((c: { text: string }) => c.text)
        .join(" ")
    )
    .join(" ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Generate spiral positions for 3D scene placement
export function generateSpiralPositions(count: number) {
  const positions: { x: number; y: number; z: number }[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const theta = i * goldenAngle;
    const r = Math.sqrt(i / count) * 8;
    positions.push({
      x: r * Math.cos(theta),
      y: (Math.random() - 0.5) * 3,
      z: r * Math.sin(theta) * 0.3 - 1,
    });
  }
  return positions;
}
