"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneStore } from "@/store/sceneStore";
import { useCursor } from "@/hooks/useCursor";
import { useTranslations } from "next-intl";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableText } from "@/components/ui/PortableText";

interface AboutData {
  name?: string;
  headline?: string;
  bio?: unknown[];
  portrait?: {
    url: string;
    lqip: string;
    dimensions: { width: number; height: number };
  };
  skills?: Array<{ name: string; category: string }>;
  cv?: string;
  availability?: "available" | "limited" | "unavailable";
  availabilityText?: string;
}

interface BioPanelProps {
  about: AboutData | null;
}

const availabilityColors = {
  available: "var(--color-available)",
  limited: "var(--color-limited)",
  unavailable: "var(--color-unavailable)",
};

export function BioPanel({ about }: BioPanelProps) {
  const { isBioOpen, setBioOpen } = useSceneStore();
  const { onEnter, onLeave } = useCursor();
  const t = useTranslations("about");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBioOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setBioOpen]);

  return (
    <AnimatePresence>
      {isBioOpen && (
        <>
          <motion.div
            className="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setBioOpen(false)}
          />

          <motion.div
            className="panel scrollable"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border opacity-40 hover:opacity-100 transition-opacity"
              style={{ borderColor: "var(--color-border)" }}
              onClick={() => setBioOpen(false)}
              onMouseEnter={onEnter("hover")}
              onMouseLeave={onLeave}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <div className="px-8 pb-20 pt-16">
              {/* Portrait */}
              {about?.portrait && (
                <div className="relative mb-8 h-48 w-48 overflow-hidden rounded-sm">
                  <SanityImage
                    image={about.portrait}
                    alt={about.name ?? "Portrait"}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Name + Availability */}
              <div className="flex items-start justify-between gap-4 mb-2">
                {about?.name && (
                  <h2 className="text-heading font-medium tracking-tight">
                    {about.name}
                  </h2>
                )}
                {about?.availability && (
                  <div className="flex items-center gap-2 mt-1 shrink-0">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: availabilityColors[about.availability] }}
                    />
                    <span className="text-sz-small opacity-60">
                      {about.availabilityText ?? t(`availability.${about.availability}`)}
                    </span>
                  </div>
                )}
              </div>

              {/* Headline */}
              {about?.headline && (
                <p className="mb-8 opacity-60 text-sz-small tracking-wide uppercase">
                  {about.headline}
                </p>
              )}

              {/* Bio */}
              {about?.bio && (
                <div className="mb-10">
                  <PortableText value={about.bio as unknown[]} />
                </div>
              )}

              {/* Skills */}
              {about?.skills && about.skills.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-sz-small opacity-40 tracking-widest uppercase mb-4">
                    Skills & Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {about.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sz-small rounded-full border"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CV Download */}
              {about?.cv && (
                <a
                  href={about.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sz-small tracking-widest uppercase border-b pb-1 transition-opacity hover:opacity-70"
                  style={{ borderColor: "var(--color-border)" }}
                  onMouseEnter={onEnter("hover")}
                  onMouseLeave={onLeave}
                >
                  {t("downloadCV")}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
