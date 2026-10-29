import type { TextStyle } from 'react-native';
import { familyForWeight, type FontFamilies } from '../fonts';
import { applyDisplayFamily } from './displayFamily';
import type { Typography } from './types';

/** Build a typography scale bound to a given font-family configuration. */
export function buildTypography(families: FontFamilies): Typography {
  const ff = (w: '400' | '500' | '600' | '700') => familyForWeight(families, w);
  const tab: TextStyle['fontVariant'] = ['tabular-nums'];

  const scale: Typography = {
    /* Hero / large titles - used on empty states and landing screens. */
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
    /* Large screen title (`HeaderBar variant="large"`). */
    heading: {
      fontFamily: ff('700'),
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '700',
      letterSpacing: 0.35,
    },
    /* Card / nav title - the headline appearance used in nav bars. */
    title: {
      fontFamily: ff('600'),
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '600',
      letterSpacing: -0.43,
    },
    /* Body text (17/22 is the default reading size on iOS). */
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
    bodyMedium: {
      fontFamily: ff('400'),
      fontSize: 16,
      lineHeight: 21,
      fontWeight: '400',
      letterSpacing: -0.32,
    },
    /* Subheadline - list subtitles and secondary text. */
    bodySmall: {
      fontFamily: ff('400'),
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: -0.24,
    },
    /* Labels - list-row primary labels and form labels. */
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
    caption: {
      fontFamily: ff('400'),
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
      letterSpacing: -0.08,
    },
    /* Small caption, semibold + tracked for uppercase section titles. */
    overline: {
      fontFamily: ff('600'),
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '600',
      letterSpacing: 0.66,
    },
    /* Monospaced / tabular variants for numeric readouts (timers, counters). */
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
  };

  return applyDisplayFamily(scale, families);
}
