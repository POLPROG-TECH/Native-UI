import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { resolveColorScheme } from '../tokens/colors';
import {
  buildTypography,
  compactTypography,
  FONT_SCALE,
  type Typography,
  type TypographyDensity,
} from '../tokens/typography';
import { systemFontFamilies, type FontFamilies } from '../tokens/fonts';
import {
  spacing,
  iconSize,
  hitSlop,
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
import { resolveThemeVariant } from './variants';
import type { Theme, NativeUIConfig } from './types';

const ThemeContext = createContext<Theme | null>(null);

export interface NativeUIProviderProps {
  config?: NativeUIConfig;
  children?: React.ReactNode;
}

type TypographyResolver = (families: FontFamilies) => Typography;

/** Map config.typography → a pure resolver. Extracted to keep the provider flat. */
function typographyResolverFor(
  override: NativeUIConfig['typography'],
  density: TypographyDensity,
): TypographyResolver | Typography {
  if (override == null) {
    return density === 'compact' ? compactTypography : buildTypography;
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
 * - `fontFamilies` default to the active variant's families (Aurora ships
 *   Space Grotesk). Load the font files in your app or pass `systemFontFamilies`
 *   to opt out.
 * - Spacing / radius / elevation tokens form a cohesive, opinionated scale.
 *
 * @example
 * ```tsx
 * <NativeUIProvider config={{ colorMode: 'dark' }}>
 *   <App />
 * </NativeUIProvider>
 * ```
 *
 * Switch to the Bloom theme:
 * ```tsx
 * import { NativeUIProvider, bloomFontFamilies } from '@polprog/native-ui';
 * <NativeUIProvider config={{ theme: 'bloom', fontFamilies: bloomFontFamilies }}>
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
    theme: themeVariant,
    colorMode = 'system',
    preset,
    fontColor = 'default',
    fontSize = 'default',
    highContrast = false,
    reduceAnimations = false,
    customAccent = null,
    fontFamilies,
    typography: typographyOverride,
    semanticTokens: semanticOverrides,
  } = config;

  // `resolveThemeVariant` returns shared registry singletons for the built-in
  // names, so `variant` stays referentially stable across renders.
  const variant = resolveThemeVariant(themeVariant);
  const resolvedPreset = preset ?? variant.colorPalette.defaultPreset;

  const isDark = useMemo(() => {
    if (colorMode === 'system') return systemScheme === 'dark';

    return colorMode === 'dark';
  }, [colorMode, systemScheme]);

  const colors = useMemo(
    () =>
      resolveColorScheme(
        {
          isDark,
          preset: resolvedPreset,
          fontColor,
          highContrast,
          customAccent,
        },
        variant.colorPalette,
      ),
    [isDark, resolvedPreset, fontColor, highContrast, customAccent, variant],
  );

  const fontScale = FONT_SCALE[fontSize];

  const fontFamiliesKey = fontFamilies ? JSON.stringify(fontFamilies) : '';
  const resolvedFontFamilies: FontFamilies = useMemo(
    () => ({ ...variant.fontFamilies, ...fontFamilies }),
    // Hash inline config so callers don't need to `useMemo` their own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fontFamiliesKey, variant],
  );

  const typography: Typography = useMemo(() => {
    const resolver = typographyResolverFor(typographyOverride, variant.typographyDensity);
    const base = typeof resolver === 'function' ? resolver(resolvedFontFamilies) : resolver;
    if (!fontScale) return base;

    // Apply the fontSize toolbar uniformly across every typography variant
    // so any component reading `theme.typography.<variant>` (Button, Input,
    // HeaderBar, etc.) scales - not only the <Text> primitive.
    const scaled = {} as Typography;
    for (const key of Object.keys(base) as Array<keyof Typography>) {
      const style = base[key];

      scaled[key] = {
        ...style,
        fontSize: style.fontSize + fontScale,
        lineHeight: style.lineHeight + fontScale,
      };
    }

    return scaled;
  }, [resolvedFontFamilies, typographyOverride, fontScale, variant]);

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

  const resolvedElevation = isDark ? variant.elevation.dark : variant.elevation.light;

  const theme = useMemo<Theme>(
    () => ({
      colors,
      typography,
      fontFamilies: resolvedFontFamilies,
      spacing,
      borderRadius: variant.borderRadius,
      iconSize,
      hitSlop,
      elevation: resolvedElevation,
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
    [
      colors,
      typography,
      resolvedFontFamilies,
      variant,
      resolvedElevation,
      semantic,
      isDark,
      reduceAnimations,
      fontScale,
    ],
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
