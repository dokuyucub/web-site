"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

export function SceneEnvironment() {
  const { scene } = useThree();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const isDark = resolvedTheme !== "light";
    scene.background = new THREE.Color(isDark ? "#080808" : "#f8f7f4");
    scene.fog = new THREE.FogExp2(isDark ? "#080808" : "#f8f7f4", 0.08);
  }, [scene, resolvedTheme]);

  return (
    <>
      {/* Ambient light — very dim */}
      <ambientLight intensity={0.3} />
      {/* Key light from top-right */}
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      {/* Fill light from bottom-left */}
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#aaaaff" />
    </>
  );
}
