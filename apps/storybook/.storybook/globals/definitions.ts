import { LOCALES, LOCALE_LABELS, type StoryLocale } from '../storyI18n';

/**
 * Single source of truth for the preview globals. The preview reads them,
 * the manager's Appearance menu renders them, and the Vitest theme matrix
 * pins them, so a new option is added in one place. Pure data on purpose:
 * the manager bundle cannot load react-native.
 */

/** Sections of the Appearance menu, in display order. */
export type GlobalGroup = 'Theme' | 'Device' | 'Accessibility' | 'Language';

export interface GlobalOption<Value extends string> {
  value: Value;
  title: string;
}

export interface GlobalDefinition<Value extends string> {
  title: string;
  description: string;
  group: GlobalGroup;
  defaultValue: Value;
  options: readonly GlobalOption<Value>[];
}

export type ThemeModeGlobal = 'light' | 'dark' | 'system' | 'side-by-side';
export type VariantGlobal = 'default' | 'bloom';
export type PresetGlobal =
  | 'default'
  | 'midnight'
  | 'forest'
  | 'sunset'
  | 'rose'
  | 'amoled'
  | 'violet'
  | 'grape'
  | 'coral'
  | 'ocean';
export type FontSizeGlobal = 'default' | 'medium' | 'large';
export type ToggleGlobal = 'off' | 'on';
export type DeviceGlobal = 'none' | 'iphone' | 'pixel' | 'ipad';

export const GLOBALS = {
  theme: {
    title: 'Mode',
    description: 'Light, dark, the OS setting, or both side by side',
    group: 'Theme',
    defaultValue: 'system',
    options: [
      { value: 'light', title: 'Light' },
      { value: 'dark', title: 'Dark' },
      { value: 'system', title: 'System' },
      { value: 'side-by-side', title: 'Side by side' },
    ],
  },
  variant: {
    title: 'Variant',
    description: 'Complete visual variant (Aurora / Bloom)',
    group: 'Theme',
    defaultValue: 'default',
    options: [
      { value: 'default', title: 'Aurora' },
      { value: 'bloom', title: 'Bloom' },
    ],
  },
  preset: {
    title: 'Accent preset',
    description: 'A preset from the other variant falls back to that variant default',
    group: 'Theme',
    defaultValue: 'default',
    options: [
      { value: 'default', title: 'Aurora · Default' },
      { value: 'midnight', title: 'Aurora · Midnight' },
      { value: 'forest', title: 'Aurora · Forest' },
      { value: 'sunset', title: 'Aurora · Sunset' },
      { value: 'rose', title: 'Aurora · Rose' },
      { value: 'amoled', title: 'Aurora · AMOLED' },
      { value: 'violet', title: 'Bloom · Violet' },
      { value: 'grape', title: 'Bloom · Grape' },
      { value: 'coral', title: 'Bloom · Coral' },
      { value: 'ocean', title: 'Ocean (both)' },
    ],
  },
  device: {
    title: 'Device frame',
    description: 'Render the story inside a phone or tablet at real proportions',
    group: 'Device',
    defaultValue: 'none',
    options: [
      { value: 'none', title: 'No frame' },
      { value: 'iphone', title: 'iPhone' },
      { value: 'pixel', title: 'Pixel' },
      { value: 'ipad', title: 'iPad' },
    ],
  },
  fontSize: {
    title: 'Font size',
    description: 'Typography tier',
    group: 'Accessibility',
    defaultValue: 'default',
    options: [
      { value: 'default', title: 'Default (100%)' },
      { value: 'medium', title: 'Medium (~115%)' },
      { value: 'large', title: 'Large (~130%)' },
    ],
  },
  highContrast: {
    title: 'Contrast',
    description: 'High-contrast accessibility mode',
    group: 'Accessibility',
    defaultValue: 'off',
    options: [
      { value: 'off', title: 'Normal' },
      { value: 'on', title: 'High contrast' },
    ],
  },
  reduceMotion: {
    title: 'Motion',
    description: 'Disable animations (iOS / Android accessibility setting)',
    group: 'Accessibility',
    defaultValue: 'off',
    options: [
      { value: 'off', title: 'Motion on' },
      { value: 'on', title: 'Reduce motion' },
    ],
  },
  locale: {
    title: 'Locale',
    description: 'UI language; also sets lang and dir on the canvas',
    group: 'Language',
    defaultValue: 'en',
    options: LOCALES.map((code) => ({
      value: code,
      title: `${code.toUpperCase()} · ${LOCALE_LABELS[code]}`,
    })),
  },
} as const satisfies {
  theme: GlobalDefinition<ThemeModeGlobal>;
  variant: GlobalDefinition<VariantGlobal>;
  preset: GlobalDefinition<PresetGlobal>;
  device: GlobalDefinition<DeviceGlobal>;
  fontSize: GlobalDefinition<FontSizeGlobal>;
  highContrast: GlobalDefinition<ToggleGlobal>;
  reduceMotion: GlobalDefinition<ToggleGlobal>;
  locale: GlobalDefinition<StoryLocale>;
};

export type GlobalKey = keyof typeof GLOBALS;

export const GLOBAL_GROUPS: readonly GlobalGroup[] = [
  'Theme',
  'Device',
  'Accessibility',
  'Language',
];
