"use client";

import { ThemeSwitcher } from "./ThemeSwitcher";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useSceneStore } from "@/store/sceneStore";
import { useCursor } from "@/hooks/useCursor";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface CornerNavProps {
  siteTitle?: string;
}

export function CornerNav({ siteTitle = "Portfolio" }: CornerNavProps) {
  const { setBioOpen, setContactOpen, isBioOpen, isContactOpen, isLoading } =
    useSceneStore();
  const { onEnter, onLeave } = useCursor();
  const t = useTranslations("nav");

  if (isLoading) return null;

  return (
    <>
      {/* Top Left — Brand */}
      <div className="fixed top-6 left-6 z-[var(--z-nav)]">
        <button
          onClick={() => useSceneStore.getState().closeAll()}
          className="text-sz-small font-medium tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity uppercase"
          onMouseEnter={onEnter("hover")}
          onMouseLeave={onLeave}
        >
          {siteTitle}
        </button>
      </div>

      {/* Top Right — Controls */}
      <div
        className="fixed top-6 right-6 z-[var(--z-nav)] flex items-center gap-5"
      >
        {/* Journal */}
        <Link
          href="/journal"
          className="text-sz-small font-medium tracking-widest opacity-40 hover:opacity-100 transition-opacity uppercase"
          onMouseEnter={onEnter("hover")}
          onMouseLeave={onLeave}
        >
          {t("journal")}
        </Link>

        {/* Bio */}
        <button
          onClick={() => setBioOpen(!isBioOpen)}
          className="text-sz-small font-medium tracking-widest opacity-40 hover:opacity-100 transition-opacity uppercase"
          onMouseEnter={onEnter("hover")}
          onMouseLeave={onLeave}
        >
          {t("bio")}
        </button>

        {/* Contact */}
        <button
          onClick={() => setContactOpen(!isContactOpen)}
          className="text-sz-small font-medium tracking-widest opacity-40 hover:opacity-100 transition-opacity uppercase"
          onMouseEnter={onEnter("hover")}
          onMouseLeave={onLeave}
        >
          {t("contact")}
        </button>

        {/* Locale Switcher */}
        <LocaleSwitcher />

        {/* Theme Switcher */}
        <ThemeSwitcher />
      </div>
    </>
  );
}
