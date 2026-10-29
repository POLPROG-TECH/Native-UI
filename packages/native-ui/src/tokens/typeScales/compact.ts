import type { TextStyle } from 'react-native';
import { familyForWeight, type FontFamilies } from '../fonts';
import { applyDisplayFamily } from './displayFamily';
import type { Typography } from './types';

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

  const scale: Typography = {
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
  };

  return applyDisplayFamily(scale, families);
}
