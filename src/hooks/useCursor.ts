"use client";

import { useSceneStore } from "@/store/sceneStore";
import type { CursorMode } from "@/store/sceneStore";

export function useCursor() {
  const setCursorMode = useSceneStore((s) => s.setCursorMode);

  const onEnter = (mode: CursorMode = "hover") => () => setCursorMode(mode);
  const onLeave = () => setCursorMode("default");

  return { onEnter, onLeave, setCursorMode };
}
