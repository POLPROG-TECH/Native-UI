import type { ColorScheme } from '../tokens/colors';
import type { Typography, TypographyDensity } from '../tokens/typography';
import type { FontFamilies } from '../tokens/fonts';
import type {
  spacing,
  iconSize,
  hitSlop,
  elevation,
  duration,
  zIndex,
  opacity,
  borderWidth,
  easing,
  glowShadow,
  BorderRadiusScale,
} from '../tokens/spacing';
import type { ThemePreset, BloomPreset, FontColor } from '../tokens/colors';
import type { FontSize } from '../tokens/typography';
import type { SemanticTokens } from '../tokens/semantic';
import type { ThemeVariant, ThemeVariantName } from './variants';

export interface Theme {
  colors: ColorScheme;
  typography: Typography;
  /** Resolved font-family map (regular/medium/semiBold/bold). */
  fontFamilies: FontFamilies;
  spacing: typeof spacing;
  borderRadius: BorderRadiusScale;
  iconSize: typeof iconSize;
  hitSlop: typeof hitSlop;
  elevation: typeof elevation;
  duration: typeof duration;
  zIndex: typeof zIndex;
  opacity: typeof opacity;
  borderWidth: typeof borderWidth;
  easing: typeof easing;
  glowShadow: typeof glowShadow;
  semantic: SemanticTokens;
  isDark: boolean;
  reduceAnimations: boolean;
  fontScale: number;
}

/** Configuration accepted by NativeUIProvider */
export interface NativeUIConfig {
  /**
   * Complete visual theme variant. `'default'` (Aurora) is the original look;
   * `'bloom'` is a violet, rounded, soft look. Pass a full
   * `ThemeVariant` object to ship your own. A variant selects colours, radii,
   * elevation, type density, and default fonts together. (default: 'default')
   */
  theme?: ThemeVariantName | ThemeVariant;
  /** Color mode: 'light', 'dark', or 'system' (default: 'system') */
  colorMode?: 'light' | 'dark' | 'system';
  /**
   * Accent preset. Aurora ships `'default' | 'midnight' | 'ocean' | 'forest' |
   * 'sunset' | 'rose' | 'amoled'`; Bloom ships `'violet' | 'grape' | 'coral' |
   * 'ocean'`. Defaults to the active variant's own default preset.
   */
  preset?: ThemePreset | BloomPreset;
  /** Font color variant (default: 'default') */
  fontColor?: FontColor;
  /** Font size tier (default: 'default') */
  fontSize?: FontSize;
  /** Enable high-contrast mode (default: false) */
  highContrast?: boolean;
  /** Reduce animations for accessibility (default: false) */
  reduceAnimations?: boolean;
  /** Custom accent color override (hex, e.g. '#FF5733') */
  customAccent?: string | null;
  /**
   * Font family overrides. Defaults to the platform system font.
   * Consumers that ship Space Grotesk can pass
   * `spaceGroteskFontFamilies` from `@polprog/native-ui`.
   */
  fontFamilies?: Partial<FontFamilies>;
  /**
   * Typography scale override. Accepts either:
   * - a `TypographyDensity` preset (`'regular'` - iOS-native, default;
   *   `'compact'` - editorial 15-pt body + larger displays),
   * - a full pre-built `Typography` object (e.g. `compactTypography(families)`),
   * - or a builder function `(families) => Typography` that receives the
   *   resolved font families so callers can derive a scale from them.
   *
   * @example
   * ```tsx
   * // Density preset:
   * <NativeUIProvider config={{ typography: 'compact' }}>
   *
   * // Builder (lets provider supply the resolved families):
   * import { compactTypography } from '@polprog/native-ui';
   * <NativeUIProvider config={{ typography: compactTypography }}>
   * ```
   */
  typography?: TypographyDensity | Typography | ((families: FontFamilies) => Typography);
  /** Semantic token overrides - partial overrides merged with defaults */
  semanticTokens?: Partial<{
    colors: Partial<SemanticTokens['colors']>;
    spacing: Partial<SemanticTokens['spacing']>;
    typography: Partial<SemanticTokens['typography']>;
  }>;
}
