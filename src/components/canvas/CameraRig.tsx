"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { getMousePosition } from "@/hooks/useMousePosition";
import { useSceneStore } from "@/store/sceneStore";

export function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0 });
  const isAnyPanelOpen = useSceneStore(
    (s) => !!s.activeProject || s.isBioOpen || s.isContactOpen
  );

  useFrame(() => {
    if (isAnyPanelOpen) return;

    const mouse = getMousePosition();

    // Smooth target tracking
    targetRef.current.x += (mouse.nx * 0.6 - targetRef.current.x) * 0.05;
    targetRef.current.y += (mouse.ny * 0.3 - targetRef.current.y) * 0.05;

    camera.position.x = targetRef.current.x;
    camera.position.y = targetRef.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
