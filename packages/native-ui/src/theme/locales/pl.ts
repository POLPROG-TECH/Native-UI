import { defaultLabels, type NativeUILabels } from '../labels';

/**
 * Polish (`pl-PL`) translation of every string the library renders. Pass it
 * as `NativeUIConfig.labels`, together with `locale: 'pl-PL'` for dates.
 * Countdown appends units straight to the number, so spelled-out units carry
 * their own leading space.
 */
export const plLabels: NativeUILabels = {
  close: 'Zamknij',
  cancel: 'Anuluj',
  confirm: 'OK',
  clear: 'Wyczyść',
  clearSearch: 'Wyczyść wyszukiwanie',
  goBack: 'Wstecz',
  loading: 'Ładowanie treści',
  loadingIndicator: 'Ładowanie',
  avatar: 'Awatar',
  requiredMarker: defaultLabels.requiredMarker,
  required: 'wymagane',
  rangeSeparator: defaultLabels.rangeSeparator,
  selectPlaceholder: 'Wybierz...',
  rangeStart: 'Od',
  rangeEnd: 'Do',
  cardHint: 'Dotknij, aby zobaczyć szczegóły',
  errorMessage: 'Coś poszło nie tak.',
  errorRetry: 'Spróbuj ponownie',
  dismiss: 'Odrzuć',
  increase: 'Zwiększ',
  decrease: 'Zmniejsz',
  pinProgress: (entered, total) => `Wpisano ${entered} z ${total} cyfr`,
  stepOf: (current, total) => `Krok ${current} z ${total}`,
  countOverflow: defaultLabels.countOverflow,
  statValue: defaultLabels.statValue,
  countdownUnits: { hours: ' godz.', minutes: ' min', seconds: ' s' },
};
