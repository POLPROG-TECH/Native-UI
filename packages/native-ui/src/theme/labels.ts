/**
 * User-facing strings rendered by the library itself: accessibility labels,
 * default button captions, placeholders and unit suffixes. Apps localise the
 * whole library through `NativeUIConfig.labels`; individual component props
 * (e.g. `Select.placeholder`) still take precedence per instance.
 */
export interface NativeUILabels {
  /** Accessible name of backdrops and close buttons (Modal, BottomSheet, Select). */
  close: string;
  /** Cancel action (Select footer, InputPrompt). */
  cancel: string;
  /** Confirm action (InputPrompt submit). */
  confirm: string;
  /** Clear button of date inputs. */
  clear: string;
  /** Clear button of SearchBar. */
  clearSearch: string;
  /** Back button of HeaderBar. */
  goBack: string;
  /** Accessible name of loading placeholders (Skeleton). */
  loading: string;
  /** Accessible name of Spinner when it has no visible label. */
  loadingIndicator: string;
  /** Accessible name of Avatar when no name is given. */
  avatar: string;
  /** Visual marker appended to required field labels. */
  requiredMarker: string;
  /** Word screen readers append to required field labels. */
  required: string;
  /** Visual separator between the start and end of a date range. */
  rangeSeparator: string;
  /** Placeholder of Select when nothing is chosen. */
  selectPlaceholder: string;
  /** Start / end field labels of DateRangePickerInput. */
  rangeStart: string;
  rangeEnd: string;
  /** Accessibility hint of pressable cards. */
  cardHint: string;
  /** Message and retry caption of the default ErrorBoundary fallback. */
  errorMessage: string;
  errorRetry: string;
  /** Accessible label of PaginationDots, e.g. "Step 2 of 5". */
  stepOf: (current: number, total: number) => string;
  /** Capped counter text in Badge / BottomTabBar, e.g. "99+". */
  countOverflow: (max: number) => string;
  /** Accessible label of StatTile, e.g. "Spent: 120 zł". */
  statValue: (label: string, value: string) => string;
  /** Unit suffixes used by Countdown ("1h 05m 09s"). */
  countdownUnits: { hours: string; minutes: string; seconds: string };
}

/** English defaults, used for every key the app does not override. */
export const defaultLabels: NativeUILabels = {
  close: 'Close',
  cancel: 'Cancel',
  confirm: 'OK',
  clear: 'Clear',
  clearSearch: 'Clear search',
  goBack: 'Go back',
  loading: 'Loading content',
  loadingIndicator: 'Loading',
  avatar: 'Avatar',
  requiredMarker: ' *',
  required: 'required',
  rangeSeparator: '-',
  selectPlaceholder: 'Select...',
  rangeStart: 'Start',
  rangeEnd: 'End',
  cardHint: 'Tap for details',
  errorMessage: 'Something went wrong.',
  errorRetry: 'Try again',
  stepOf: (current, total) => `Step ${current} of ${total}`,
  countOverflow: (max) => `${max}+`,
  statValue: (label, value) => `${label}: ${value}`,
  countdownUnits: { hours: 'h', minutes: 'm', seconds: 's' },
};

/**
 * BCP 47 locale used for date formatting when neither the component nor
 * `NativeUIConfig.locale` provides one. Kept as `en-US` for compatibility
 * with releases that hardcoded it.
 */
export const DEFAULT_LOCALE = 'en-US';

/** Merges partial overrides over the defaults, including nested unit labels. */
export function resolveLabels(overrides?: Partial<NativeUILabels>): NativeUILabels {
  if (!overrides) {
    return defaultLabels;
  }

  return {
    ...defaultLabels,
    ...overrides,
    countdownUnits: { ...defaultLabels.countdownUnits, ...overrides.countdownUnits },
  };
}
