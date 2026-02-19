"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSceneStore } from "@/store/sceneStore";

export function LoadingScreen() {
  const isLoading = useSceneStore((s) => s.isLoading);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!isLoading) return;
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const animation = path.animate(
      [
        { strokeDashoffset: length },
        { strokeDashoffset: 0 },
      ],
      { duration: 1200, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );

    return () => animation.cancel();
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            backgroundColor: "var(--color-bg)",
            zIndex: "var(--z-loading)",
          }}
        >
          {/* Signature / logo SVG animation */}
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              ref={pathRef}
              d="M10 50 C20 10, 40 10, 50 30 C60 50, 80 50, 90 30 C100 10, 110 20, 115 40"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              style={{ color: "var(--color-fg)" }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
