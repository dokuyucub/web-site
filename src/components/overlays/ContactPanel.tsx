"use client";

import { useEffect, useState, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneStore } from "@/store/sceneStore";
import { useCursor } from "@/hooks/useCursor";
import { useTranslations } from "next-intl";
import { submitContact } from "@/lib/actions/contact";

interface SocialLinks {
  email?: string;
  behance?: string;
  dribbble?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

interface ContactPanelProps {
  social: SocialLinks | null;
}

export function ContactPanel({ social }: ContactPanelProps) {
  const { isContactOpen, setContactOpen } = useSceneStore();
  const { onEnter, onLeave } = useCursor();
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const [state, formAction, isPending] = useActionState(submitContact, null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setContactOpen]);

  const copyEmail = () => {
    if (!social?.email) return;
    navigator.clipboard.writeText(social.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    { label: "Behance", url: social?.behance },
    { label: "Dribbble", url: social?.dribbble },
    { label: "Instagram", url: social?.instagram },
    { label: "LinkedIn", url: social?.linkedin },
    { label: "GitHub", url: social?.github },
    { label: "X / Twitter", url: social?.twitter },
  ].filter((s) => s.url);

  return (
    <AnimatePresence>
      {isContactOpen && (
        <>
          <motion.div
            className="panel-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setContactOpen(false)}
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
              onClick={() => setContactOpen(false)}
              onMouseEnter={onEnter("hover")}
              onMouseLeave={onLeave}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <div className="px-8 pb-20 pt-16">
              {/* Title */}
              <h2 className="text-heading font-medium tracking-tight mb-8">
                {t("title")}
              </h2>

              {/* Email display */}
              {social?.email && (
                <button
                  onClick={copyEmail}
                  className="group flex items-center gap-3 mb-10 text-sm transition-opacity hover:opacity-70"
                  onMouseEnter={onEnter("hover")}
                  onMouseLeave={onLeave}
                >
                  <span className="font-medium">{social.email}</span>
                  <span
                    className="text-sz-small opacity-0 group-hover:opacity-40 transition-opacity"
                  >
                    {copied ? t("copied") : t("copyEmail")}
                  </span>
                </button>
              )}

              {/* Contact form */}
              {state?.success ? (
                <div className="py-8 text-center opacity-70">
                  <p>{t("form.success")}</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder={t("form.name")}
                      required
                      className="w-full px-4 py-3 text-sm bg-transparent border rounded-sm outline-none focus:opacity-100 opacity-70 placeholder:opacity-40 transition-opacity"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                  <div>
                    <input
                      name="email"
                      type="email"
                      placeholder={t("form.email")}
                      required
                      className="w-full px-4 py-3 text-sm bg-transparent border rounded-sm outline-none focus:opacity-100 opacity-70 placeholder:opacity-40 transition-opacity"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>
                  <div>
                    <select
                      name="budget"
                      className="w-full px-4 py-3 text-sm bg-transparent border rounded-sm outline-none opacity-70 transition-opacity"
                      style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
                    >
                      <option value="">{t("form.budgetOptions.placeholder")}</option>
                      <option value="small">{t("form.budgetOptions.small")}</option>
                      <option value="medium">{t("form.budgetOptions.medium")}</option>
                      <option value="large">{t("form.budgetOptions.large")}</option>
                      <option value="enterprise">{t("form.budgetOptions.enterprise")}</option>
                    </select>
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder={t("form.message")}
                      required
                      rows={5}
                      className="w-full px-4 py-3 text-sm bg-transparent border rounded-sm outline-none focus:opacity-100 opacity-70 placeholder:opacity-40 transition-opacity resize-none"
                      style={{ borderColor: "var(--color-border)" }}
                    />
                  </div>

                  {state?.error && (
                    <p className="text-sz-small" style={{ color: "var(--color-unavailable)" }}>
                      {t("form.error")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 text-sm tracking-widest uppercase border rounded-sm transition-opacity hover:opacity-70 disabled:opacity-30"
                    style={{ borderColor: "var(--color-border)" }}
                    onMouseEnter={onEnter("hover")}
                    onMouseLeave={onLeave}
                  >
                    {isPending ? t("form.sending") : t("form.send")}
                  </button>
                </form>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div className="mt-10 pt-8 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sz-small tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
                        onMouseEnter={onEnter("hover")}
                        onMouseLeave={onLeave}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
