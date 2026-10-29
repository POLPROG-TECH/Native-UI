import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);

  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
}

function readPreference(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/* Server render (static docs build) has no media query; assume motion is fine. */
function readServerPreference(): boolean {
  return false;
}

/** Live `prefers-reduced-motion` flag that follows OS setting changes. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, readPreference, readServerPreference);
}
