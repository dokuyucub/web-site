"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableText } from "@/components/ui/PortableText";
import type { SanityProject } from "@/store/sceneStore";
import { getProjectBySlug } from "../../../sanity/lib/queries";

interface MobileExperienceProps {
  projects: SanityProject[];
  homepage: { heroHeadline?: string; heroSubtext?: string } | null;
}

export function MobileExperience({ projects, homepage }: MobileExperienceProps) {
  const [activeProject, setActiveProject] = useState<SanityProject | null>(null);
  const [fullProject, setFullProject] = useState<SanityProject | null>(null);

  const openProject = async (project: SanityProject) => {
    setActiveProject(project);
    const full = await getProjectBySlug(project.slug.current);
    setFullProject(full);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-fg)" }}
    >
      {/* Hero */}
      {(homepage?.heroHeadline || homepage?.heroSubtext) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="px-6 pt-24 pb-12"
        >
          {homepage.heroHeadline && (
            <h1 className="text-display font-medium tracking-tight mb-3">
              {homepage.heroHeadline}
            </h1>
          )}
          {homepage.heroSubtext && (
            <p className="opacity-50">{homepage.heroSubtext}</p>
          )}
        </motion.div>
      )}

      {/* Projects grid */}
      <div className="px-4 pb-24 space-y-4">
        {projects.map((project, i) => (
          <motion.button
            key={project._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => openProject(project)}
            className="group relative w-full overflow-hidden rounded-sm text-left"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <SanityImage
                image={project.coverImage}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw"
                className="transition-transform duration-500 group-active:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              />
            </div>
            <div className="pt-3 pb-1 px-1">
              <h3 className="font-medium tracking-tight">{project.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sz-small opacity-40">
                {project.category?.title && <span>{project.category.title}</span>}
                {project.year && <span>{project.year}</span>}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mobile Project Detail Modal */}
      <AnimatePresence>
        {activeProject && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setActiveProject(null); setFullProject(null); }}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl overflow-hidden"
              style={{ backgroundColor: "var(--color-bg)", maxHeight: "90vh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 rounded-full opacity-20" style={{ backgroundColor: "var(--color-fg)" }} />
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 40px)" }}>
                {/* Cover */}
                <div className="relative h-56 overflow-hidden">
                  <SanityImage
                    image={activeProject.coverImage}
                    alt={activeProject.title}
                    fill
                    sizes="100vw"
                  />
                </div>

                <div className="px-6 pb-16 pt-5">
                  <h2 className="text-heading font-medium tracking-tight mb-4">
                    {activeProject.title}
                  </h2>
                  <div className="flex gap-4 text-sz-small opacity-40 mb-6">
                    {activeProject.year && <span>{activeProject.year}</span>}
                    {activeProject.category?.title && <span>{activeProject.category.title}</span>}
                  </div>
                  {activeProject.shortDescription && (
                    <p className="opacity-70 leading-relaxed mb-6">{activeProject.shortDescription}</p>
                  )}
                  {fullProject?.body && (
                    <PortableText value={fullProject.body as unknown[]} />
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
