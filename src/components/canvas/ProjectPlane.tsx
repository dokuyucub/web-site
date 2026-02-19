"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore, type SanityProject } from "@/store/sceneStore";
import {
  projectCardVertexShader as vertexShader,
  projectCardFragmentShader as fragmentShader,
} from "./shaders";

interface ProjectPlaneProps {
  project: SanityProject;
  position: [number, number, number];
  size: [number, number];
  index: number;
}

const CARD_SIZES = {
  small: [1.4, 1.0] as [number, number],
  medium: [2.0, 1.4] as [number, number],
  large: [2.8, 2.0] as [number, number],
};

export function ProjectPlane({ project, position, size, index }: ProjectPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverProgress = useRef(0);
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const timeRef = useRef(0);

  const { setActiveProject, setCursorMode, activeProject } = useSceneStore();
  const isActive = activeProject?._id === project._id;

  // Load project texture
  const texture = useTexture(project.coverImage.url);

  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
    }
  }, [texture]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uHover: { value: 0 },
        uAlpha: { value: 1 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      transparent: true,
      depthWrite: false,
    });
  }, [texture, vertexShader, fragmentShader]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    timeRef.current += delta;

    // Update time uniform for grain animation
    material.uniforms.uTime.value = timeRef.current;

    // Smooth hover transition
    const targetHover = isHovered ? 1 : 0;
    hoverProgress.current += (targetHover - hoverProgress.current) * 0.08;
    material.uniforms.uHover.value = hoverProgress.current;

    // Floating animation
    const floatY = Math.sin(timeRef.current * 0.5 + floatOffset.current) * 0.06;
    const floatRotX = Math.sin(timeRef.current * 0.3 + floatOffset.current) * 0.01;
    const floatRotY = Math.cos(timeRef.current * 0.4 + floatOffset.current) * 0.01;

    mesh.position.y = position[1] + floatY;
    mesh.rotation.x = floatRotX + hoverProgress.current * -0.05;
    mesh.rotation.y = floatRotY + hoverProgress.current * 0.05;

    // Z offset on hover (come forward)
    const targetZ = position[2] + hoverProgress.current * 0.4;
    mesh.position.z += (targetZ - mesh.position.z) * 0.1;

    // Scale on hover
    const targetScale = 1 + hoverProgress.current * 0.04;
    mesh.scale.setScalar(targetScale);

    // Fade out when another project is active
    if (isActive || (!activeProject)) {
      material.uniforms.uAlpha.value +=
        ((isActive ? 1 : 1) - material.uniforms.uAlpha.value) * 0.1;
    } else {
      material.uniforms.uAlpha.value +=
        (0.3 - material.uniforms.uAlpha.value) * 0.1;
    }
  });

  const cardSize = project.cardSize ?? "medium";
  const [w, h] = CARD_SIZES[cardSize] ?? CARD_SIZES.medium;

  return (
    <mesh
      ref={meshRef}
      position={position}
      material={material}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        setCursorMode("project");
        document.body.style.cursor = "none";
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        setCursorMode("default");
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!project.isPasswordProtected || true) {
          setActiveProject(project);
        }
      }}
    >
      <planeGeometry args={[w, h, 32, 32]} />
    </mesh>
  );
}
