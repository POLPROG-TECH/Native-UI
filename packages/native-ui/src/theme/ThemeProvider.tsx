import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { resolveColorScheme } from '../tokens/colors';
import {
  buildTypography,
  compactTypography,
  DEFAULT_TYPOGRAPHY_DENSITY,
  FONT_SCALE,
  type Typography,
} from '../tokens/typography';
import { spaceGroteskFontFamilies, systemFontFamilies, type FontFamilies } from '../tokens/fonts';
import {
  spacing,
  borderRadius,
  iconSize,
  hitSlop,
  elevation,
  duration,
  zIndex,
  opacity,
  borderWidth,
  easing,
  glowShadow,
} from '../tokens/spacing';
import {
  defaultSemanticColors,
  defaultSemanticSpacing,
  defaultSemanticTypography,
} from '../tokens/semantic';
import type { SemanticTokens } from '../tokens/semantic';
import type { Theme, NativeUIConfig } from './types';

const ThemeContext = createContext<Theme | null>(null);

export interface NativeUIProviderProps {
  config?: NativeUIConfig;
  children?: React.ReactNode;
}

/**
 * Default font families applied when `NativeUIProvider.config.fontFamilies`
 * is omitted. Space Grotesk is the branded choice that ships with the design
 * system's reference look. Consumers are responsible for loading the actual
 * font files (e.g. via `expo-font` / `@expo-google-fonts/space-grotesk`).
 *
 * If Space Grotesk is not loaded, React Native falls back to the platform
 * system font at runtime - text remains readable but loses the branded feel.
 * Pass `systemFontFamilies` explicitly to skip Space Grotesk entirely.
 */
const DEFAULT_FONT_FAMILIES: FontFamilies = spaceGroteskFontFamilies;

type TypographyResolver = (families: FontFamilies) => Typography;

/** Map config.typography → a pure resolver. Extracted to keep the provider flat. */
function typographyResolverFor(
  override: NativeUIConfig['typography'],
): TypographyResolver | Typography {
  if (override == null) {
    return DEFAULT_TYPOGRAPHY_DENSITY === 'compact' ? compactTypography : buildTypography;
  }
  if (typeof override === 'function') return override;
  if (override === 'compact') return compactTypography;
  if (override === 'regular') return buildTypography;
  // Fully-formed Typography object - consumer pre-built it with their own families.
  return override;
}

/**
 * Provides theme context to all native-ui components.
 *
 * Defaults are tuned for a modern, branded mobile look:
 * - `typography` density is `'compact'` (15-pt body, larger displays).
 * - `fontFamilies` default to Space Grotesk (`DEFAULT_FONT_FAMILIES`). Load
 *   the font files in your app or pass `systemFontFamilies` to opt out.
 * - Spacing / radius / elevation tokens form a cohesive, opinionated scale.
 *
 * @example
 * ```tsx
 * <NativeUIProvider config={{ colorMode: 'dark' }}>
 *   <App />
 * </NativeUIProvider>
 * ```
 *
 * Override to an iOS-native look:
 * ```tsx
 * <NativeUIProvider
 *   config={{ typography: 'regular', fontFamilies: systemFontFamilies }}
 * >
 *   <App />
 * </NativeUIProvider>
 * ```
 */
export function NativeUIProvider({ config = {}, children }: NativeUIProviderProps) {
  const systemScheme = useColorScheme();

  const {
    colorMode = 'system',
    preset = 'default',
    fontColor = 'default',
    fontSize = 'default',
    highContrast = false,
    reduceAnimations = false,
    customAccent = null,
    fontFamilies,
    typography: typographyOverride,
    semanticTokens: semanticOverrides,
  } = config;

  const isDark = useMemo(() => {
    if (colorMode === 'system') return systemScheme === 'dark';
    return colorMode === 'dark';
  }, [colorMode, systemScheme]);

  const colors = useMemo(
    () =>
      resolveColorScheme({
        isDark,
        preset,
        fontColor,
        highContrast,
        customAccent,
      }),
    [isDark, preset, fontColor, highContrast, customAccent],
  );

  const fontScale = FONT_SCALE[fontSize];

  const fontFamiliesKey = fontFamilies ? JSON.stringify(fontFamilies) : '';
  const resolvedFontFamilies: FontFamilies = useMemo(
    () => ({ ...DEFAULT_FONT_FAMILIES, ...fontFamilies }),
    // Hash inline config so callers don't need to `useMemo` their own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fontFamiliesKey],
  );

  const typography: Typography = useMemo(() => {
    const resolver = typographyResolverFor(typographyOverride);
    const base = typeof resolver === 'function' ? resolver(resolvedFontFamilies) : resolver;
    if (!fontScale) return base;
    // Apply the fontSize toolbar uniformly across every typography variant
    // so any component reading `theme.typography.<variant>` (Button, Input,
    // HeaderBar, etc.) scales - not only the <Text> primitive.
    const scaled = {} as Typography;
    for (const key of Object.keys(base) as Array<keyof Typography>) {
      const variant = base[key];
      scaled[key] = {
        ...variant,
        fontSize: variant.fontSize + fontScale,
        lineHeight: variant.lineHeight + fontScale,
      };
    }
    return scaled;
  }, [resolvedFontFamilies, typographyOverride, fontScale]);

  const semanticKey = semanticOverrides ? JSON.stringify(semanticOverrides) : '';
  const semantic = useMemo<SemanticTokens>(
    () => ({
      colors: { ...defaultSemanticColors, ...semanticOverrides?.colors },
      spacing: { ...defaultSemanticSpacing, ...semanticOverrides?.spacing },
      typography: { ...defaultSemanticTypography, ...semanticOverrides?.typography },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [semanticKey],
  );

  const theme = useMemo<Theme>(
    () => ({
      colors,
      typography,
      fontFamilies: resolvedFontFamilies,
      spacing,
      borderRadius,
      iconSize,
      hitSlop,
      elevation,
      duration,
      zIndex,
      opacity,
      borderWidth,
      easing,
      glowShadow,
      semantic,
      isDark,
      reduceAnimations,
      fontScale,
    }),
    [colors, typography, resolvedFontFamilies, semantic, isDark, reduceAnimations, fontScale],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Access the current theme. Must be used within NativeUIProvider. */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error(
      'useTheme must be used within a NativeUIProvider. ' +
        'Wrap your app root with <NativeUIProvider>.',
    );
  }
  return theme;
}

// Internal guard so `systemFontFamilies` import isn't tree-shaken away - it's
// part of the documented opt-out path and re-exported from the package root.
void systemFontFamilies;

/** Shorthand to access only the resolved color scheme. */
export function useColors() {
  return useTheme().colors;
}

/** Alias for useColors - matches CostBoard naming convention. */
export const useThemeColors = useColors;

/** Access only the semantic tokens from the current theme. */
export function useSemantic(): SemanticTokens {
  return useTheme().semantic;
}
