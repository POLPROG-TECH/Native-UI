import { createContext, useContext, useRef, type ReactNode, type RefObject } from 'react';
import { SHOWCASE_MOTION, SHOWCASE_SCENES } from './showcaseConfig';
import { useComponentInspector, type ComponentInspector } from './useComponentInspector';
import { useReducedMotion } from './useReducedMotion';
import { useSceneCycle, type SceneCycle } from './useSceneCycle';
import { useShowcaseApp, type ShowcaseApp } from './useShowcaseApp';

/** State the hero device and the anatomy panel share. */
export interface ShowcaseContextValue {
  app: ShowcaseApp;
  cycle: SceneCycle;
  inspector: ComponentInspector;
  reducedMotion: boolean;
  /** Hovering or focusing here holds the theme rotation. */
  stageRef: RefObject<HTMLDivElement | null>;
  /** Coordinate space of the inspector outlines. */
  deviceRef: RefObject<HTMLDivElement | null>;
  /** The interactive (non-outgoing) screen layer the anatomy tree reads. */
  liveLayerRef: RefObject<HTMLDivElement | null>;
}

const ShowcaseContext = createContext<ShowcaseContextValue | null>(null);

/**
 * Owns the demo app, theme cycle and inspector, so the device in the hero and
 * the "Screen anatomy" panel below it stay in sync without prop drilling
 * across the MDX page.
 */
export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const liveLayerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const app = useShowcaseApp();
  const inspector = useComponentInspector(deviceRef);
  const cycle = useSceneCycle({
    scenes: SHOWCASE_SCENES,
    durationMs: SHOWCASE_MOTION.sceneDurationMs,
    autoplay: !reducedMotion,
    holdRef: stageRef,
  });

  /* app, cycle and inspector are fresh objects each render, so memoising the value buys nothing. */
  const value: ShowcaseContextValue = {
    app,
    cycle,
    inspector,
    reducedMotion,
    stageRef,
    deviceRef,
    liveLayerRef,
  };

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>;
}

export function useShowcase(): ShowcaseContextValue {
  const value = useContext(ShowcaseContext);

  if (!value) {
    throw new Error('HeroShowcase and ScreenAnatomy must be rendered inside <ShowcaseProvider>.');
  }

  return value;
}
