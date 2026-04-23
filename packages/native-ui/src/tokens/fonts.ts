import { Platform } from 'react-native';

/**
 * Font family configuration. Consumers can load any custom font (for example
 * Space Grotesk via Google Fonts) and pass it in via `NativeUIProvider`.
 * If no custom family is provided, the platform system font is used.
 */
export interface FontFamilies {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}

/** Platform system font fallback (safe default - no asset loading required). */
export const systemFontFamilies: FontFamilies = {
  regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }) as string,
  medium: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }) as string,
  semiBold: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }) as string,
  bold: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }) as string,
};

/** Space Grotesk preset - requires the Space Grotesk family to be loaded by the consumer. */
export const spaceGroteskFontFamilies: FontFamilies = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semiBold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
};

/** Weight → family lookup used when building typography variants. */
export function familyForWeight(
  families: FontFamilies,
  weight: '400' | '500' | '600' | '700',
): string {
  switch (weight) {
    case '700':
      return families.bold;
    case '600':
      return families.semiBold;
    case '500':
      return families.medium;
    default:
      return families.regular;
  }
}

/**
 * Locales whose scripts are not covered by Space Grotesk - these must fall
 * back to the platform system font to render glyphs correctly.
 */
const NON_LATIN_LOCALES = new Set([
  'zh',
  'zh-CN',
  'zh-TW',
  'zh-HK',
  'ja',
  'ko',
  'ar',
  'he',
  'th',
  'hi',
  'ur',
  'bn',
  'ta',
  'te',
  'fa',
  'my',
  'km',
  'si',
]);

/**
 * Resolve the appropriate {@link FontFamilies} for a given locale.
 *
 * @param locale BCP-47 language tag (e.g. `'pl'`, `'ja'`, `'zh-CN'`).
 * @param preferred Latin-script preset (defaults to Space Grotesk).
 * @returns `systemFontFamilies` for non-Latin locales, otherwise `preferred`.
 *
 * @example
 * ```tsx
 * <ThemeProvider fontFamilies={familiesForLocale(i18n.language)}>...</ThemeProvider>
 * ```
 */
export function familiesForLocale(
  locale: string | undefined,
  preferred: FontFamilies = spaceGroteskFontFamilies,
): FontFamilies {
  if (!locale) return preferred;

  const lower = locale.toLowerCase();
  const primary = lower.split('-')[0] ?? lower;
  if (NON_LATIN_LOCALES.has(primary) || NON_LATIN_LOCALES.has(lower)) {
    return systemFontFamilies;
  }

  return preferred;
}
