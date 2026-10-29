import type { Globals } from 'storybook/internal/types';
import { GLOBALS } from './globals/definitions';

export type DocsScheme = 'light' | 'dark';

/** Attribute on <html> that docs pages and custom sections style against. */
export const SCHEME_ATTRIBUTE = 'data-nui-scheme';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DARK_SCHEME_QUERY).matches;
}

/**
 * The scheme the whole Storybook chrome follows for a value of the Mode
 * global: explicit light / dark win, "system" and "side by side" follow the
 * OS. Shared by the manager (sidebar, toolbar) and the preview (docs pages).
 */
export function schemeForMode(mode: unknown): DocsScheme {
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }

  return prefersDark() ? 'dark' : 'light';
}

export function schemeForGlobals(globals: Globals | undefined): DocsScheme {
  return schemeForMode(globals?.theme ?? GLOBALS.theme.defaultValue);
}

/** Reads the `globals` field of a SET_GLOBALS / GLOBALS_UPDATED payload. */
export function globalsOf(payload: unknown): Globals | undefined {
  if (typeof payload !== 'object' || payload === null || !('globals' in payload)) {
    return undefined;
  }

  const { globals } = payload;

  return typeof globals === 'object' && globals !== null ? { ...globals } : undefined;
}

/** Calls `onChange` when the OS scheme flips, for the "system" mode. */
export function watchOsScheme(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_SCHEME_QUERY);

  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
}
