"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneStore } from "@/store/sceneStore";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableText } from "@/components/ui/PortableText";
import { useCursor } from "@/hooks/useCursor";
import { useTranslations } from "next-intl";
import { getProjectBySlug } from "../../../sanity/lib/queries";

export function ProjectDetail() {
  const { activeProject, setActiveProject } = useSceneStore();
  const { onEnter, onLeave } = useCursor();
  const t = useTranslations("project");
  const [fullProject, setFullProject] = useState<typeof activeProject>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Fetch full project data when active project changes
  useEffect(() => {
    if (!activeProject) {
      setFullProject(null);
      setUnlocked(false);
      setPasswordInput("");
      setPasswordError(false);
      return;
    }
    getProjectBySlug(activeProject.slug.current).then(setFullProject);
  }, [activeProject]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setActiveProject]);

  const handleUnlock = async () => {
    const res = await fetch("/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: activeProject?.slug.current,
        password: passwordInput,
      }),
    });
    if (res.ok) {
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const isProtected = activeProject?.isPasswordProtected && !unlocked;

  return (
    <AnimatePresence>
      {activeProject && (
        <>
          {/* Backdrop */}
          <motion.div
            className="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveProject(null)}
          />

          {/* Panel */}
          <motion.div
            className="panel scrollable"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-opacity opacity-40 hover:opacity-100"
              style={{ borderColor: "var(--color-border)" }}
              onClick={() => setActiveProject(null)}
              onMouseEnter={onEnter("hover")}
              onMouseLeave={onLeave}
              aria-label={t("close")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            {/* Cover Image */}
            <div className="relative h-[40vh] w-full overflow-hidden">
              <SanityImage
                image={activeProject.coverImage}
                alt={activeProject.title}
                fill
                priority
                sizes="min(640px, 92vw)"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 50%, var(--color-bg) 100%)" }}
              />
            </div>

            <div className="px-8 pb-20">
              {/* Title */}
              <h1 className="text-heading font-medium mt-6 mb-4 tracking-tight">
                {activeProject.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap gap-6 mb-8 text-sz-small" style={{ color: "var(--color-fg-secondary)" }}>
                {activeProject.year && (
                  <span>
                    <span className="opacity-50 mr-2 tracking-widest uppercase">{t("year")}</span>
                    {activeProject.year}
                  </span>
                )}
                {activeProject.category && (
                  <span>
                    <span className="opacity-50 mr-2 tracking-widest uppercase">{t("category")}</span>
                    {activeProject.category.title}
                  </span>
                )}
                {activeProject.tools && activeProject.tools.length > 0 && (
                  <span>
                    <span className="opacity-50 mr-2 tracking-widest uppercase">{t("tools")}</span>
                    {activeProject.tools.join(", ")}
                  </span>
                )}
              </div>

              {/* Short description */}
              {activeProject.shortDescription && (
                <p className="mb-8 opacity-70 leading-relaxed">
                  {activeProject.shortDescription}
                </p>
              )}

              {/* Password protection */}
              {isProtected ? (
                <div className="py-12 text-center">
                  <div className="mb-4 opacity-50">
                    <svg className="mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <p className="mb-6 opacity-60">{t("passwordProtected")}</p>
                  <div className="flex gap-3 max-w-xs mx-auto">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                      placeholder={t("enterPassword")}
                      className="flex-1 px-4 py-2 text-sm rounded-sm border bg-transparent outline-none focus:opacity-100"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                    <button
                      onClick={handleUnlock}
                      className="px-4 py-2 text-sm rounded-sm border transition-opacity hover:opacity-70"
                      style={{ borderColor: "var(--color-border)" }}
                      onMouseEnter={onEnter("hover")}
                      onMouseLeave={onLeave}
                    >
                      {t("unlock")}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-3 text-sz-small" style={{ color: "var(--color-unavailable)" }}>
                      {t("wrongPassword")}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Body content */}
                  {fullProject?.body && (
                    <PortableText value={fullProject.body as unknown[]} />
                  )}

                  {/* Live URL */}
                  {fullProject?.projectUrl && (
                    <div className="mt-10">
                      <a
                        href={fullProject.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sz-small tracking-widest uppercase border-b pb-1 transition-opacity hover:opacity-70"
                        style={{ borderColor: "var(--color-border)" }}
                        onMouseEnter={onEnter("hover")}
                        onMouseLeave={onLeave}
                      >
                        {t("viewLive")}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
