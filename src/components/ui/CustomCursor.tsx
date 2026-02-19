"use client";

import { useEffect, useRef } from "react";
import { useSceneStore } from "@/store/sceneStore";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cursorMode = useSceneStore((s) => s.cursorMode);

  useEffect(() => {
    // Only on pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.18, ease: "power2.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.18, ease: "power2.out" });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Update cursor appearance based on mode
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    const config = {
      default: {
        dotScale: 1,
        ringScale: 0,
        ringOpacity: 0,
        mixBlend: "normal" as const,
        label: "",
      },
      hover: {
        dotScale: 0,
        ringScale: 1,
        ringOpacity: 1,
        mixBlend: "normal" as const,
        label: "",
      },
      project: {
        dotScale: 0,
        ringScale: 4,
        ringOpacity: 1,
        mixBlend: "difference" as const,
        label: "OPEN",
      },
      drag: {
        dotScale: 1.5,
        ringScale: 2,
        ringOpacity: 0.6,
        mixBlend: "normal" as const,
        label: "",
      },
      text: {
        dotScale: 0,
        ringScale: 0,
        ringOpacity: 0,
        mixBlend: "normal" as const,
        label: "",
      },
    };

    const c = config[cursorMode] ?? config.default;

    gsap.to(dot, { scale: c.dotScale, duration: 0.3, ease: "power2.out" });
    gsap.to(ring, {
      scale: c.ringScale,
      opacity: c.ringOpacity,
      mixBlendMode: c.mixBlend,
      duration: 0.4,
      ease: "power3.out",
    });

    if (label) {
      label.textContent = c.label;
      gsap.to(label, { opacity: c.label ? 1 : 0, duration: 0.2 });
    }
  }, [cursorMode]);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
        style={{ backgroundColor: "var(--color-fg)" }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[var(--z-cursor)] flex -translate-x-1/2 -translate-y-1/2 h-10 w-10 origin-center scale-0 items-center justify-center rounded-full border opacity-0"
        style={{ borderColor: "var(--color-fg)" }}
      >
        <span
          ref={labelRef}
          className="select-none text-[10px] font-medium tracking-widest opacity-0"
          style={{ color: "var(--color-fg)" }}
        />
      </div>
    </>
  );
}
