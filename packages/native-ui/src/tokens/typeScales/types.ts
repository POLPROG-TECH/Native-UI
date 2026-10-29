import type { TextStyle } from 'react-native';

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
};
