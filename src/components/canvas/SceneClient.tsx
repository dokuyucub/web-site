"use client";

import dynamic from "next/dynamic";
import type { SanityProject } from "@/store/sceneStore";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => null,
});

interface SceneClientProps {
  projects: SanityProject[];
}

export function SceneClient({ projects }: SceneClientProps) {
  return <Scene projects={projects} />;
}
