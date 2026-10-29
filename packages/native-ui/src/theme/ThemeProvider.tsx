import React, { createContext, useContext, useMemo } from 'react';
import {
  iconSize,
  hitSlop,
  duration,
  zIndex,
  opacity,
  borderWidth,
  easing,
  glowShadow,
} from '../tokens/spacing';
import type { SemanticTokens } from '../tokens/semantic';
import { resolveThemeVariant, type ThemeVariant } from './variants';
import { DEFAULT_LOCALE, type NativeUILabels } from './labels';
import {
  type ColorParts,
  type ScaleParts,
  type TypographyParts,
  useColorParts,
  useLabelParts,
  useScaleParts,
  useSemanticTokens,
  useTypographyParts,
} from './themeParts';
import type { Theme, NativeUIConfig } from './types';

const ThemeContext = createContext<Theme | null>(null);

export interface NativeUIProviderProps {
  config?: NativeUIConfig;
  children?: React.ReactNode;
}

/** Global tokens that no config option changes. */
const STATIC_TOKENS = {
  iconSize,
  hitSlop,
  duration,
  zIndex,
  opacity,
  borderWidth,
  easing,
  glowShadow,
} as const;

interface ThemeParts {
  variant: ThemeVariant;
  color: ColorParts;
  type: TypographyParts;
  scales: ScaleParts;
  semantic: SemanticTokens;
  labels: NativeUILabels;
  reduceAnimations: boolean;
  locale: string;
}

function assembleTheme({ variant, color, type, scales, ...rest }: ThemeParts): Theme {
  return {
    ...STATIC_TOKENS,
    ...scales,
    ...type,
    ...rest,
    colors: color.colors,
    isDark: color.isDark,
    elevation: color.isDark ? variant.elevation.dark : variant.elevation.light,
  };
}

/** Resolves every config option into one memoised `Theme`. */
function useThemeValue(config: NativeUIConfig): Theme {
  /* Built-in names resolve to registry singletons, so `variant` is stable. */
  const variant = resolveThemeVariant(config.theme);
  const color = useColorParts(config, variant);
  const type = useTypographyParts(config, variant);
  const scales = useScaleParts(config, variant);
  const semantic = useSemanticTokens(config.semanticTokens);
  const labels = useLabelParts(config.labels);
  const reduceAnimations = config.reduceAnimations ?? false;
  const locale = config.locale ?? DEFAULT_LOCALE;

  return useMemo(
    () =>
      assembleTheme({ variant, color, type, scales, semantic, labels, reduceAnimations, locale }),
    [variant, color, type, scales, semantic, labels, reduceAnimations, locale],
  );
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
  const theme = useThemeValue(config);

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

/** Shorthand to access only the resolved color scheme. */
export function useColors() {
  return useTheme().colors;
}

/** Access the resolved library strings (see `NativeUIConfig.labels`). */
export function useLabels(): NativeUILabels {
  return useTheme().labels;
}

/** Access only the semantic tokens from the current theme. */
export function useSemantic(): SemanticTokens {
  return useTheme().semantic;
}
