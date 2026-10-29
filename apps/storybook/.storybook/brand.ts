/**
 * Docs brand palette (indigo chrome around the library's own presets).
 * Shared by the manager theme and the Docs theme so light and dark stay in
 * sync. It is pure data: the manager bundle cannot load react-native, so it
 * cannot read the library's runtime tokens.
 */
export interface BrandPalette {
  primary: string;
  appBg: string;
  contentBg: string;
  previewBg: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  barBg: string;
  inputBg: string;
  inputBorder: string;
  buttonBg: string;
  booleanBg: string;
}

export const BRAND = {
  light: {
    primary: '#4F46E5',
    appBg: '#F8FAFC',
    contentBg: '#FFFFFF',
    previewBg: '#FFFFFF',
    border: '#E2E8F0',
    text: '#0F172A',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',
    barBg: '#FFFFFF',
    inputBg: '#FFFFFF',
    inputBorder: '#CBD5E1',
    buttonBg: '#F1F5F9',
    booleanBg: '#E2E8F0',
  },
  dark: {
    primary: '#A5B4FC',
    appBg: '#0B0F1A',
    contentBg: '#0F1424',
    previewBg: '#0F1424',
    border: '#1F2937',
    text: '#E5E7EB',
    textMuted: '#94A3B8',
    textInverse: '#0B0F1A',
    barBg: '#0F1424',
    inputBg: '#111827',
    inputBorder: '#334155',
    buttonBg: '#1E293B',
    booleanBg: '#1E293B',
  },
} as const satisfies Record<'light' | 'dark', BrandPalette>;

export const BRAND_FONTS = {
  base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  code: '"SF Mono", "JetBrains Mono", "Fira Code", monospace',
} as const;
