"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CameraRig } from "./CameraRig";
import { SceneEnvironment } from "./Environment";
import { ParticleSystem } from "./ParticleSystem";
import { ProjectField } from "./ProjectField";
import { useSceneStore, type SanityProject } from "@/store/sceneStore";
import { useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  const { setLoading, setSceneReady } = useSceneStore();

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setLoading(false);
        setSceneReady(true);
      }, 800);
    }
  }, [progress, setLoading, setSceneReady]);

  return null;
}

interface SceneProps {
  projects: SanityProject[];
}

export function Scene({ projects }: SceneProps) {
  return (
    <div className="canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          alpha: false,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={<Loader />}>
          <Loader />
          <SceneEnvironment />
          <CameraRig />
          <ParticleSystem />
          <ProjectField projects={projects} />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.8}
              luminanceSmoothing={0.4}
              intensity={0.3}
              blendFunction={BlendFunction.ADD}
            />
            <ChromaticAberration
              offset={new THREE.Vector2(0.0008, 0.0008)}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise
              opacity={0.04}
              blendFunction={BlendFunction.OVERLAY}
            />
            <Vignette
              offset={0.3}
              darkness={0.6}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
