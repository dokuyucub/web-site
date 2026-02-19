"use client";

import { Suspense } from "react";
import { ProjectPlane } from "./ProjectPlane";
import type { SanityProject } from "@/store/sceneStore";
import { generateSpiralPositions } from "@/lib/utils";

interface ProjectFieldProps {
  projects: SanityProject[];
}

export function ProjectField({ projects }: ProjectFieldProps) {
  const autoPositions = generateSpiralPositions(projects.length);

  return (
    <Suspense fallback={null}>
      {projects.map((project, index) => {
        const auto = autoPositions[index];
        const custom = project.scenePosition;

        const position: [number, number, number] = [
          custom?.x ?? auto.x,
          custom?.y ?? auto.y,
          custom?.z ?? auto.z,
        ];

        const cardSize = project.cardSize ?? "medium";
        const sizeMap = {
          small: [1.4, 1.0] as [number, number],
          medium: [2.0, 1.4] as [number, number],
          large: [2.8, 2.0] as [number, number],
        };
        const size = sizeMap[cardSize];

        return (
          <ProjectPlane
            key={project._id}
            project={project}
            position={position}
            size={size}
            index={index}
          />
        );
      })}
    </Suspense>
  );
}
