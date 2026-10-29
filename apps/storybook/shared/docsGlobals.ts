import { useSyncExternalStore } from 'react';
import type { Globals } from 'storybook/internal/types';

/** Languages the guide pages and custom docs sections are written in. */
export type DocsLanguage = 'en' | 'pl';

export const DOCS_LANGUAGES: readonly DocsLanguage[] = ['en', 'pl'];

/** Pages fall back to English for locales without a translation (es, de, ar). */
export const FALLBACK_DOCS_LANGUAGE: DocsLanguage = 'en';

let snapshot: Globals = {};
const listeners = new Set<() => void>();

/**
 * Latest preview globals for docs pages. Stories get globals through
 * decorators, but MDX content and the custom docs sections render outside
 * any decorator, so the preview feeds this store from the channel
 * (see .storybook/preview/docsScheme.tsx) and components subscribe to it.
 */
export function setDocsGlobals(globals: Globals): void {
  snapshot = globals;
  listeners.forEach((listener) => listener());
}

export function getDocsGlobals(): Globals {
  return snapshot;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function languageOf(globals: Globals): DocsLanguage {
  const locale: unknown = globals.locale;

  return DOCS_LANGUAGES.find((language) => language === locale) ?? FALLBACK_DOCS_LANGUAGE;
}

/** Re-renders when any global changes; selectors keep the result typed. */
export function useDocsGlobal<Value>(select: (globals: Globals) => Value): Value {
  return useSyncExternalStore(
    subscribe,
    () => select(snapshot),
    () => select({}),
  );
}

/** Language of the guide text, from the Locale global in the Appearance menu. */
export function useDocsLanguage(): DocsLanguage {
  return useDocsGlobal(languageOf);
}

/** Picks the copy for the current docs language from a per-language table. */
export function useLocalized<Copy>(copy: Record<DocsLanguage, Copy>): Copy {
  return copy[useDocsLanguage()];
}
