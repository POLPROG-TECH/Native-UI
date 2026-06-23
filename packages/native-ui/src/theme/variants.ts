import { Platform, type ViewStyle } from 'react-native';
import { defaultColorPalette, type ColorPalette } from '../tokens/colors';
import { bloomColorPalette } from '../tokens/bloomPalette';
import {
  borderRadius,
  elevation,
  type BorderRadiusScale,
  type ElevationScale,
  type Elevation,
} from '../tokens/spacing';
import { DEFAULT_TYPOGRAPHY_DENSITY, type TypographyDensity } from '../tokens/typography';
import { spaceGroteskFontFamilies, bloomFontFamilies, type FontFamilies } from '../tokens/fonts';

export type ThemeVariantName = 'default' | 'bloom';

/**
 * A complete visual identity. Where `preset`/`colorMode` only swap accents,
 * a variant bundles the whole look - colour foundation, corner radii,
 * elevation, type density, and default fonts - behind a single name. The
 * `NativeUIProvider` resolves one into the `Theme` object, so every component
 * restyles without any component-level changes.
 */
export interface ThemeVariant {
  /** Stable identifier used by the registry and `config.theme`. */
  id: ThemeVariantName;
  /** friendly label, e.g. for a theme switcher. */
  name: string;
  /** Colour foundation resolved per mode and preset. */
  colorPalette: ColorPalette;
  /** Corner-radius scale applied across components. */
  borderRadius: BorderRadiusScale;
  /** Shadow presets; the provider picks one by colour mode. */
  elevation: { light: ElevationScale; dark: ElevationScale };
  /** Default typography density when the consumer doesn't override it. */
  typographyDensity: TypographyDensity;
  /** Default font families for the variant (still overridable via config). */
  fontFamilies: FontFamilies;
}

// ── Aurora (default) ────────────────────────────────────────────
// Wraps the library's original tokens by reference, so the default render path
// is referentially identical to before this variant system existed.
export const defaultThemeVariant: ThemeVariant = {
  id: 'default',
  name: 'Aurora',
  colorPalette: defaultColorPalette,
  borderRadius,
  elevation: { light: elevation, dark: elevation },
  typographyDensity: DEFAULT_TYPOGRAPHY_DENSITY,
  fontFamilies: spaceGroteskFontFamilies,
};

const bloomBorderRadius: BorderRadiusScale = {
  xs: 8,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 26,
  '2xl': 30,
  full: 9999,
};

function bloomElevation(
  shadowColor: string,
  opacity: Record<Exclude<Elevation, 'none'>, number>,
): ElevationScale {
  const step = (height: number, radius: number, o: number, androidElevation: number): ViewStyle =>
    Platform.select({
      ios: {
        shadowColor,
        shadowOffset: { width: 0, height },
        shadowOpacity: o,
        shadowRadius: radius,
      },
      android: { elevation: androidElevation },
      default: {},
    })!;

  return {
    none: elevation.none,
    xs: step(1, 3, opacity.xs, 1),
    sm: step(2, 6, opacity.sm, 2),
    md: step(4, 14, opacity.md, 3),
    lg: step(10, 24, opacity.lg, 6),
    xl: step(16, 36, opacity.xl, 10),
  };
}

const bloomElevationLight = bloomElevation('#5028a0', {
  xs: 0.04,
  sm: 0.07,
  md: 0.1,
  lg: 0.18,
  xl: 0.22,
});
const bloomElevationDark = bloomElevation('#000000', {
  xs: 0.2,
  sm: 0.3,
  md: 0.42,
  lg: 0.55,
  xl: 0.62,
});

export const bloomThemeVariant: ThemeVariant = {
  id: 'bloom',
  name: 'Bloom',
  colorPalette: bloomColorPalette,
  borderRadius: bloomBorderRadius,
  elevation: { light: bloomElevationLight, dark: bloomElevationDark },
  typographyDensity: 'compact',
  fontFamilies: bloomFontFamilies,
};

export const THEME_VARIANTS: Record<ThemeVariantName, ThemeVariant> = {
  default: defaultThemeVariant,
  bloom: bloomThemeVariant,
};

/**
 * Resolve a `config.theme` value to a concrete variant. Built-in names return
 * shared registry singletons, so the provider's memoised theme keeps a stable
 * reference across renders; a full `ThemeVariant` object is returned as-is.
 */
export function resolveThemeVariant(
  theme: ThemeVariantName | ThemeVariant | undefined,
): ThemeVariant {
  if (theme == null) return defaultThemeVariant;
  if (typeof theme === 'string') {
    const variant = THEME_VARIANTS[theme as ThemeVariantName];

    if (variant) return variant;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(
        `[native-ui] Unknown theme variant "${theme}" - falling back to "${defaultThemeVariant.name}".`,
      );
    }

    return defaultThemeVariant;
  }

  return theme;
}
