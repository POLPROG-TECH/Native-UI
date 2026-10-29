import { useCallback, useEffect, useState, type RefObject } from 'react';
import { sameScene, type ShowcaseScene } from './showcaseConfig';

export interface SceneCycleOptions {
  /** At least one scene: the first one is shown before the cycle starts. */
  scenes: readonly [ShowcaseScene, ...ShowcaseScene[]];
  durationMs: number;
  /** Autoplay starts off when the user prefers reduced motion. */
  autoplay: boolean;
  /** Hovering or focusing inside this element holds the current scene. */
  holdRef: RefObject<HTMLElement | null>;
}

export interface SceneCycle {
  scene: ShowcaseScene;
  /** Scene shown before the latest change, kept while the reveal plays. */
  previous: ShowcaseScene | null;
  /** Bumps on every change; keys the reveal layer so its animation restarts. */
  revision: number;
  /** Playlist position, or -1 once the visitor customised the theme in-app. */
  index: number;
  playing: boolean;
  select: (index: number) => void;
  /** Applies a change made inside the demo app and stops autoplay. */
  customize: (patch: Partial<ShowcaseScene>) => void;
  togglePlaying: () => void;
  settle: () => void;
}

interface CycleState {
  scene: ShowcaseScene;
  previous: ShowcaseScene | null;
  revision: number;
  index: number;
}

/** True while the pointer or keyboard focus is inside the element. */
function useHeld(ref: RefObject<HTMLElement | null>): boolean {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const hold = () => setHeld(true);
    const release = () => setHeld(false);
    const releaseFocus = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget instanceof Node ? event.relatedTarget : null)) {
        release();
      }
    };

    element.addEventListener('pointerenter', hold);
    element.addEventListener('pointerleave', release);
    element.addEventListener('focusin', hold);
    element.addEventListener('focusout', releaseFocus);

    return () => {
      element.removeEventListener('pointerenter', hold);
      element.removeEventListener('pointerleave', release);
      element.removeEventListener('focusin', hold);
      element.removeEventListener('focusout', releaseFocus);
    };
  }, [ref]);

  return held;
}

/** True while the element is on screen and the tab is visible. */
function useOnScreen(ref: RefObject<HTMLElement | null>): boolean {
  const [intersecting, setIntersecting] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setIntersecting(entry.isIntersecting);
      }
    });
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');

    observer.observe(element);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ref]);

  return intersecting && pageVisible;
}

function advance(state: CycleState, scene: ShowcaseScene, index: number): CycleState {
  if (sameScene(state.scene, scene)) {
    return { ...state, index };
  }

  return { scene, previous: state.scene, revision: state.revision + 1, index };
}

/**
 * Rotates through scenes on a timer. The timer only runs while nobody is
 * interacting with the device and it is visible, so a scene never changes
 * under the user's pointer and no frames are spent off screen.
 */
export function useSceneCycle({
  scenes,
  durationMs,
  autoplay,
  holdRef,
}: SceneCycleOptions): SceneCycle {
  const [state, setState] = useState<CycleState>(() => ({
    scene: scenes[0],
    previous: null,
    revision: 0,
    index: 0,
  }));
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const held = useHeld(holdRef);
  const onScreen = useOnScreen(holdRef);
  const playing = userPlaying ?? autoplay;

  const select = useCallback(
    (index: number) =>
      setState((current) => {
        const scene = scenes[index];

        return scene ? advance(current, scene, index) : current;
      }),
    [scenes],
  );

  const customize = useCallback((patch: Partial<ShowcaseScene>) => {
    setUserPlaying(false);
    setState((current) => advance(current, { ...current.scene, ...patch }, -1));
  }, []);

  useEffect(() => {
    if (!playing || held || !onScreen) {
      return undefined;
    }

    const next = (state.index + 1) % scenes.length;
    const timer = window.setTimeout(() => select(next), durationMs);

    return () => window.clearTimeout(timer);
  }, [playing, held, onScreen, state.index, scenes.length, durationMs, select]);

  const togglePlaying = useCallback(() => setUserPlaying(!playing), [playing]);
  const settle = useCallback(() => setState((current) => ({ ...current, previous: null })), []);

  return { ...state, playing, select, customize, togglePlaying, settle };
}
