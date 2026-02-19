"use client";

import { useEffect, useRef } from "react";

interface MousePosition {
  x: number;
  y: number;
  // Normalized -1 to 1
  nx: number;
  ny: number;
}

const mousePosition: MousePosition = { x: 0, y: 0, nx: 0, ny: 0 };

export function useMousePosition() {
  const positionRef = useRef<MousePosition>(mousePosition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
      mousePosition.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.ny = -(e.clientY / window.innerHeight) * 2 + 1;
      positionRef.current = { ...mousePosition };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return positionRef;
}

// Singleton getter for use in R3F useFrame
export function getMousePosition() {
  return mousePosition;
}
