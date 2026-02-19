"use client";

import { create } from "zustand";

export type CursorMode = "default" | "hover" | "project" | "drag" | "text";

export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: {
    url: string;
    lqip: string;
    dimensions: { width: number; height: number };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  shortDescription?: string;
  category?: { title: string; slug: { current: string }; color?: string };
  tags?: string[];
  year?: number;
  featured?: boolean;
  featuredOrder?: number;
  cardSize?: "small" | "medium" | "large";
  scenePosition?: { x: number; y: number; z: number };
  isPasswordProtected?: boolean;
  body?: unknown[];
  images?: unknown[];
  tools?: string[];
  projectUrl?: string;
  seo?: unknown;
}

interface SceneStore {
  // Active project (detail panel open)
  activeProject: SanityProject | null;
  setActiveProject: (project: SanityProject | null) => void;

  // Bio panel
  isBioOpen: boolean;
  setBioOpen: (open: boolean) => void;

  // Contact panel
  isContactOpen: boolean;
  setContactOpen: (open: boolean) => void;

  // Cursor mode
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;

  // Scene ready state
  isSceneReady: boolean;
  setSceneReady: (ready: boolean) => void;

  // Loading screen visible
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Helper: close all panels
  closeAll: () => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  activeProject: null,
  setActiveProject: (project) =>
    set({ activeProject: project, isBioOpen: false, isContactOpen: false }),

  isBioOpen: false,
  setBioOpen: (open) =>
    set({ isBioOpen: open, activeProject: open ? null : undefined, isContactOpen: false }),

  isContactOpen: false,
  setContactOpen: (open) =>
    set({ isContactOpen: open, activeProject: open ? null : undefined, isBioOpen: false }),

  cursorMode: "default",
  setCursorMode: (mode) => set({ cursorMode: mode }),

  isSceneReady: false,
  setSceneReady: (ready) => set({ isSceneReady: ready }),

  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),

  closeAll: () =>
    set({ activeProject: null, isBioOpen: false, isContactOpen: false }),
}));
