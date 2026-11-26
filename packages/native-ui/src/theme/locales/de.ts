import { defaultLabels, type NativeUILabels } from '../labels';

/**
 * German (`de-DE`) translation of every string the library renders. Pass it
 * as `NativeUIConfig.labels`, together with `locale: 'de-DE'` for dates.
 * Countdown appends units straight to the number, so spelled-out units carry
 * their own leading space ("2 Std. 14 Min.").
 */
export const deLabels: NativeUILabels = {
  close: 'Schließen',
  cancel: 'Abbrechen',
  confirm: 'OK',
  clear: 'Löschen',
  clearSearch: 'Suche löschen',
  goBack: 'Zurück',
  loading: 'Inhalt wird geladen',
  loadingIndicator: 'Wird geladen',
  avatar: 'Avatar',
  requiredMarker: defaultLabels.requiredMarker,
  required: 'erforderlich',
  rangeSeparator: defaultLabels.rangeSeparator,
  selectPlaceholder: 'Auswählen...',
  rangeStart: 'Beginn',
  rangeEnd: 'Ende',
  cardHint: 'Für Details tippen',
  errorMessage: 'Etwas ist schiefgelaufen.',
  errorRetry: 'Erneut versuchen',
  dismiss: 'Ausblenden',
  increase: 'Erhöhen',
  decrease: 'Verringern',
  pinProgress: (entered, total) => `${entered} von ${total} Ziffern eingegeben`,
  stepOf: (current, total) => `Schritt ${current} von ${total}`,
  countOverflow: defaultLabels.countOverflow,
  statValue: defaultLabels.statValue,
  countdownUnits: { hours: ' Std.', minutes: ' Min.', seconds: ' Sek.' },
};
