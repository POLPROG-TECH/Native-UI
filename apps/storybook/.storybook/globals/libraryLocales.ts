import { arLabels, deLabels, esLabels, plLabels, type NativeUILabels } from '@polprog/native-ui';
import type { StoryLocale } from '../storyI18n';

/**
 * What the Locale global hands to NativeUIProvider: the BCP 47 tag for date
 * and number formatting, and the strings the library renders itself
 * (Cancel, Close, "Select...", required markers, Countdown units, a11y
 * labels). English uses the library defaults, so it has no overrides; the
 * other languages use the label packs the library ships.
 */
export interface LibraryLocale {
  bcp47: string;
  labels?: Partial<NativeUILabels>;
}

export const LIBRARY_LOCALES: Record<StoryLocale, LibraryLocale> = {
  en: { bcp47: 'en-US' },
  pl: { bcp47: 'pl-PL', labels: plLabels },
  es: { bcp47: 'es-ES', labels: esLabels },
  de: { bcp47: 'de-DE', labels: deLabels },
  ar: { bcp47: 'ar', labels: arLabels },
};
