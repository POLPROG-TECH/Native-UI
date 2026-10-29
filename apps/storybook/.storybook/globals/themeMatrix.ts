import type { GlobalKey } from './definitions';

/** One pinned combination of preview globals that the whole story suite runs under. */
export interface ThemeRun {
  /** Vitest project name; `storybook` stays the default light run. */
  project: string;
  /** Chromatic mode name for the same combination. */
  mode: string;
  globals: Partial<Record<GlobalKey, string>>;
}

/**
 * Every run pins `theme`: the default Mode is "system", which would make a
 * run depend on the colour scheme of the machine it happens on.
 *
 * Theme runs shared by Vitest (one project each) and Chromatic (one mode
 * each), so visual and behavioural coverage stay in step.
 */
export const THEME_MATRIX: readonly ThemeRun[] = [
  { project: 'storybook', mode: 'light', globals: { theme: 'light' } },
  { project: 'storybook-dark', mode: 'dark', globals: { theme: 'dark' } },
  { project: 'storybook-rtl', mode: 'rtl', globals: { theme: 'light', locale: 'ar' } },
  {
    project: 'storybook-large-contrast',
    mode: 'large-text-high-contrast',
    globals: { theme: 'light', fontSize: 'large', highContrast: 'on' },
  },
];
