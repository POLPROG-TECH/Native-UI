import type { TextStyle } from 'react-native';
import { systemFontFamilies, familyForWeight, type FontFamilies } from './fonts';

/**
 * Typography scale tuned to the iOS 17 system text styles, with equivalent
 * metrics that feel native on Android. Variant names below map to the
 * platform-native text style each one targets:
 *
 *   Variant          Native equivalent          Size / Line / Weight
 *   ──────────────   ────────────────────────   ────────────────────
 *   displayLarge     Large title (bold)          34 / 41 / 700
 *   displayMedium    Title (bold)                28 / 34 / 700
 *   h1               Title                       28 / 34 / 600
 *   h2               Title 2                     22 / 28 / 600
 *   h3               Title 3                     20 / 25 / 600
 *   heading          Title 2 (bold)              22 / 28 / 700
 *   title            Headline                    17 / 22 / 600
 *   bodyLarge        Body (emphasised)           17 / 22 / 500
 *   body             Body                        17 / 22 / 400
 *   bodyMedium       Callout                     16 / 21 / 400
 *   bodySmall        Subheadline                 15 / 20 / 400
 *   label            Headline                    17 / 22 / 600
 *   labelSmall       Subheadline (semibold)      15 / 20 / 600
 *   caption          Footnote                    13 / 18 / 400
 *   overline         Caption 2 (uppercase)       11 / 13 / 600
 *   mono...          Tabular figure variants
 */
export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
  letterSpacing?: number;
  fontVariant?: TextStyle['fontVariant'];
}

export type Typography = {
  displayLarge: TypographyStyle;
  displayMedium: TypographyStyle;
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  /** Screen header - bold variant, 22/28 700. */
  heading: TypographyStyle;
  /** App-bar / card title, 17/22 600. */
  title: TypographyStyle;
  bodyLarge: TypographyStyle;
  body: TypographyStyle;
  bodySmall: TypographyStyle;
  /** Callout - secondary body text, 16/21 400. */
  bodyMedium: TypographyStyle;
  label: TypographyStyle;
  labelSmall: TypographyStyle;
  caption: TypographyStyle;
  /** Uppercase section titles, 11/13 600 with letterSpacing. */
  overline: TypographyStyle;
  mono: TypographyStyle;
  monoLarge: TypographyStyle;
  monoSmall: TypographyStyle;
  /** @deprecated Use `mono` instead */
  amount: TypographyStyle;
  /** @deprecated Use `monoLarge` instead */
  amountLarge: TypographyStyle;
  /** @deprecated Use `monoSmall` instead */
  amountSmall: TypographyStyle;
};

/** Build a typography scale bound to a given font-family configuration. */
export function buildTypography(families: FontFamilies): Typography {
  const ff = (w: '400' | '500' | '600' | '700') => familyForWeight(families, w);
  const tab: TextStyle['fontVariant'] = ['tabular-nums'];
  return {
    // Hero / large titles - used on empty states and landing screens.
    displayLarge: {
      fontFamily: ff('700'),
      fontSize: 34,
      lineHeight: 41,
      fontWeight: '700',
      letterSpacing: 0.37,
    },
    displayMedium: {
      fontFamily: ff('700'),
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      letterSpacing: 0.36,
    },
    // Section headings.
    h1: {
      fontFamily: ff('600'),
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '600',
      letterSpacing: 0.36,
    },
    h2: {
      fontFamily: ff('600'),
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600',
      letterSpacing: 0.35,
    },
    h3: {
      fontFamily: ff('600'),
      fontSize: 20,
      lineHeight: 25,
      fontWeight: '600',
      letterSpacing: 0.38,
    },
    // Screen header - bold variant used by `ListHeader` and `HeaderBar`.
    heading: {
      fontFamily: ff('700'),
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700',
      letterSpacing: 0.35,
    },
    // Card / nav title - the headline appearance used in nav bars.
    title: {
      fontFamily: ff('600'),
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
      letterSpacing: -0.43,
    },
    // Body text (17/22 is the default reading size on iOS).
    bodyLarge: {
      fontFamily: ff('500'),
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '500',
      letterSpacing: -0.43,
    },
    body: {
      fontFamily: ff('400'),
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '400',
      letterSpacing: -0.43,
    },
    // Callout.
    bodyMedium: {
      fontFamily: ff('400'),
      fontSize: 16,
      lineHeight: 21,
      fontWeight: '400',
      letterSpacing: -0.32,
    },
    // Subheadline - list subtitles and secondary text.
    bodySmall: {
      fontFamily: ff('400'),
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: -0.24,
    },
    // Labels - list-row primary labels and form labels.
    label: {
      fontFamily: ff('600'),
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
      letterSpacing: -0.43,
    },
    labelSmall: {
      fontFamily: ff('600'),
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      letterSpacing: -0.24,
    },
    // Footnote.
    caption: {
      fontFamily: ff('400'),
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
      letterSpacing: -0.08,
    },
    // Small caption, semibold + tracked for uppercase section titles.
    overline: {
      fontFamily: ff('600'),
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '600',
      letterSpacing: 0.66,
    },
    // Monospaced / tabular variants for numeric readouts (timers, counters).
    mono: {
      fontFamily: ff('700'),
      fontSize: 20,
      lineHeight: 25,
      fontWeight: '700',
      fontVariant: tab,
      letterSpacing: 0.38,
    },
    monoLarge: {
      fontFamily: ff('700'),
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      letterSpacing: 0.36,
      fontVariant: tab,
    },
    monoSmall: {
      fontFamily: ff('600'),
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      fontVariant: tab,
      letterSpacing: -0.24,
    },
    amount: {
      fontFamily: ff('700'),
      fontSize: 20,
      lineHeight: 25,
      fontWeight: '700',
      fontVariant: tab,
      letterSpacing: 0.38,
    },
    amountLarge: {
      fontFamily: ff('700'),
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
      letterSpacing: 0.36,
      fontVariant: tab,
    },
    amountSmall: {
      fontFamily: ff('600'),
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      fontVariant: tab,
      letterSpacing: -0.24,
    },
  };
}

/** Default (system-font) typography scale. Use `buildTypography()` with custom families
 * to opt into Space Grotesk via the NativeUIProvider `fontFamilies` config. */
export const typography: Typography = buildTypography(systemFontFamilies);

/**
 * Compact typography scale - denser, editorial-style sizing with larger display
 * headings and a 15-pt reading body. Suited to content-heavy apps that want a
 * branded, dense type scale instead of the platform-native 17-pt body.
 *
 * Use via the `NativeUIProvider` `typography` config:
 * ```tsx
 * import { compactTypography, spaceGroteskFontFamilies } from '@polprog/native-ui';
 * <NativeUIProvider config={{
 *   fontFamilies: spaceGroteskFontFamilies,
 *   typography: compactTypography,
 * }}>
 * ```
 *
 * Scale reference:
 * - hero/displayLarge 48/56 700 · h1/displayMedium 32/38 700 · h1 32/38 600
 * - h2 26/32 600 · h3 21/28 600 · heading 24/30 700 · title 18/24 600
 * - bodyLarge 17/22 500 · body 15/22 400 · bodyMedium 14/20 400 · bodySmall 12/16 400
 * - label 13/18 600 · labelSmall 12/16 600 · caption 11/14 400 · overline 10/12 600
 * - mono 18/24 700 · monoLarge 32/38 700 · monoSmall 13/18 600
 */
export function compactTypography(families: FontFamilies): Typography {
  const ff = (w: '400' | '500' | '600' | '700') => familyForWeight(families, w);
  const tab: TextStyle['fontVariant'] = ['tabular-nums'];
  return {
    displayLarge: {
      fontFamily: ff('700'),
      fontSize: 48,
      lineHeight: 56,
      fontWeight: '700',
      letterSpacing: 0.37,
    },
    displayMedium: {
      fontFamily: ff('700'),
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '700',
      letterSpacing: 0.36,
    },
    h1: {
      fontFamily: ff('600'),
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '600',
      letterSpacing: 0.36,
    },
    h2: {
      fontFamily: ff('600'),
      fontSize: 26,
      lineHeight: 32,
      fontWeight: '600',
      letterSpacing: 0.35,
    },
    h3: {
      fontFamily: ff('600'),
      fontSize: 21,
      lineHeight: 28,
      fontWeight: '600',
      letterSpacing: 0.38,
    },
    heading: {
      fontFamily: ff('700'),
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '700',
      letterSpacing: 0.35,
    },
    title: {
      fontFamily: ff('600'),
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600',
      letterSpacing: -0.43,
    },
    bodyLarge: {
      fontFamily: ff('500'),
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '500',
      letterSpacing: -0.43,
    },
    body: {
      fontFamily: ff('400'),
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400',
      letterSpacing: -0.24,
    },
    bodyMedium: {
      fontFamily: ff('400'),
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: -0.16,
    },
    bodySmall: {
      fontFamily: ff('400'),
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0,
    },
    label: {
      fontFamily: ff('600'),
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      letterSpacing: -0.08,
    },
    labelSmall: {
      fontFamily: ff('600'),
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      letterSpacing: 0,
    },
    caption: {
      fontFamily: ff('400'),
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '400',
      letterSpacing: 0,
    },
    overline: {
      fontFamily: ff('600'),
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '600',
      letterSpacing: 0.66,
    },
    mono: {
      fontFamily: ff('700'),
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
      fontVariant: tab,
      letterSpacing: 0,
    },
    monoLarge: {
      fontFamily: ff('700'),
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '700',
      letterSpacing: 0.36,
      fontVariant: tab,
    },
    monoSmall: {
      fontFamily: ff('600'),
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      fontVariant: tab,
      letterSpacing: -0.08,
    },
    amount: {
      fontFamily: ff('700'),
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700',
      fontVariant: tab,
      letterSpacing: 0,
    },
    amountLarge: {
      fontFamily: ff('700'),
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '700',
      letterSpacing: 0.36,
      fontVariant: tab,
    },
    amountSmall: {
      fontFamily: ff('600'),
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600',
      fontVariant: tab,
      letterSpacing: -0.08,
    },
  };
}

/**
 * Typography density presets.
 *
 * - `'compact'` - editorial 15-pt body scale, larger display sizes. **Default**
 *   for Native-UI. Designed as a branded, editorial type scale that reads
 *   comfortably across dense content-heavy screens.
 * - `'regular'` - iOS 17-native scale (17-pt body). Closer to stock Apple
 *   system UI. Opt in via `<NativeUIProvider config={{ typography: 'regular' }} />`.
 */
export type TypographyDensity = 'regular' | 'compact';

/** Default density applied when `NativeUIProvider.config.typography` is omitted. */
export const DEFAULT_TYPOGRAPHY_DENSITY: TypographyDensity = 'compact';

/**
 * Resolve a typography scale for a given density + font families.
 * Exposed as a convenience so app code can pick presets declaratively.
 */
export function resolveTypography(density: TypographyDensity, families: FontFamilies): Typography {
  return density === 'compact' ? compactTypography(families) : buildTypography(families);
}

/** Font size scaling multipliers for accessibility */
export const FONT_SCALE: Record<FontSize, number> = {
  default: 0,
  medium: 2,
  large: 4,
};

export type TypographyVariant = keyof Typography;
export type FontSize = 'default' | 'medium' | 'large';
