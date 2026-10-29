import { useMemo } from 'react';
import { typedKeys } from '../utils/typedKeys';
import { useColorScheme } from 'react-native';
import { resolveColorScheme, type ColorScheme } from '../tokens/colors';
import {
  buildTypography,
  compactTypography,
  FONT_SCALE,
  type Typography,
  type TypographyDensity,
} from '../tokens/typography';
import type { FontFamilies } from '../tokens/fonts';
import { duration, spacing, type BorderRadiusScale, type SpacingScale } from '../tokens/spacing';
import {
  defaultSemanticColors,
  defaultSemanticSpacing,
  defaultSemanticTypography,
  type SemanticTokens,
} from '../tokens/semantic';
import { resolveComponentTokens, type ComponentTokens } from '../tokens/components';
import { resolveLabels, type NativeUILabels } from './labels';
import { useJsonStable } from './useJsonStable';
import { useShallowStable } from './useShallowStable';
import type { ThemeVariant } from './variants';
import type { NativeUIConfig } from './types';

type TypographyResolver = (families: FontFamilies) => Typography;

/** Maps `config.typography` to either a builder or a ready scale. */
function typographyResolverFor(
  override: NativeUIConfig['typography'],
  density: TypographyDensity,
): TypographyResolver | Typography {
  if (override == null) {
    return density === 'compact' ? compactTypography : buildTypography;
  }

  if (typeof override === 'function') {
    return override;
  }

  if (override === 'compact') {
    return compactTypography;
  }

  if (override === 'regular') {
    return buildTypography;
  }

  return override;
}

/**
 * Applies the `fontSize` accessibility tier to every variant, so components
 * that read `theme.typography.<variant>` directly scale too, not only `<Text>`.
 */
export function scaleTypography(base: Typography, fontScale: number): Typography {
  if (!fontScale) {
    return base;
  }

  const scaled: Typography = { ...base };

  for (const key of typedKeys(base)) {
    const style = base[key];

    scaled[key] = {
      ...style,
      fontSize: style.fontSize + fontScale,
      lineHeight: style.lineHeight + fontScale,
    };
  }

  return scaled;
}

export interface ColorParts {
  isDark: boolean;
  colors: ColorScheme;
}

export interface TypographyParts {
  typography: Typography;
  fontFamilies: FontFamilies;
  fontScale: number;
}

export interface ScaleParts {
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  components: ComponentTokens;
}

export function useColorParts(config: NativeUIConfig, variant: ThemeVariant): ColorParts {
  const systemScheme = useColorScheme();
  const mode = config.colorMode ?? 'system';
  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const { preset, fontColor = 'default', highContrast = false } = config;
  const { customAccent = null, minTextContrast } = config;

  const colors = useMemo(
    () =>
      resolveColorScheme(
        {
          isDark,
          preset: preset ?? variant.colorPalette.defaultPreset,
          fontColor,
          highContrast,
          customAccent,
          minContrast: minTextContrast,
        },
        variant.colorPalette,
      ),
    [isDark, preset, fontColor, highContrast, customAccent, minTextContrast, variant],
  );

  return useMemo(() => ({ isDark, colors }), [isDark, colors]);
}

export function useTypographyParts(config: NativeUIConfig, variant: ThemeVariant): TypographyParts {
  const fontScale = FONT_SCALE[config.fontSize ?? 'default'];
  const familyOverrides = useJsonStable(config.fontFamilies);
  const typographyOverride = config.typography;

  const fontFamilies = useMemo<FontFamilies>(
    () => ({ ...variant.fontFamilies, ...familyOverrides }),
    [familyOverrides, variant],
  );

  const typography = useMemo(() => {
    const resolver = typographyResolverFor(typographyOverride, variant.typographyDensity);
    const base = typeof resolver === 'function' ? resolver(fontFamilies) : resolver;

    return scaleTypography(base, fontScale);
  }, [fontFamilies, typographyOverride, fontScale, variant]);

  return useMemo(
    () => ({ typography, fontFamilies, fontScale }),
    [typography, fontFamilies, fontScale],
  );
}

export function useScaleParts(config: NativeUIConfig, variant: ThemeVariant): ScaleParts {
  const spacingOverrides = useJsonStable(config.spacing);
  const radiusOverrides = useJsonStable(config.borderRadius);
  const componentOverrides = useJsonStable(config.components);

  const resolvedSpacing = useMemo(() => ({ ...spacing, ...spacingOverrides }), [spacingOverrides]);
  const borderRadius = useMemo(
    () => ({ ...variant.borderRadius, ...radiusOverrides }),
    [radiusOverrides, variant],
  );
  const components = useMemo(
    () =>
      resolveComponentTokens(
        { spacing: resolvedSpacing, borderRadius, duration },
        componentOverrides,
      ),
    [componentOverrides, resolvedSpacing, borderRadius],
  );

  return useMemo(
    () => ({ spacing: resolvedSpacing, borderRadius, components }),
    [resolvedSpacing, borderRadius, components],
  );
}

export function useSemanticTokens(overrides: NativeUIConfig['semanticTokens']): SemanticTokens {
  const stable = useJsonStable(overrides);

  return useMemo(
    () => ({
      colors: { ...defaultSemanticColors, ...stable?.colors },
      spacing: { ...defaultSemanticSpacing, ...stable?.spacing },
      typography: { ...defaultSemanticTypography, ...stable?.typography },
    }),
    [stable],
  );
}

/** Labels may hold functions (`stepOf`), which JSON hashing would drop. */
export function useLabelParts(overrides: NativeUIConfig['labels']): NativeUILabels {
  const stable = useShallowStable(overrides);

  return useMemo(() => resolveLabels(stable), [stable]);
}
