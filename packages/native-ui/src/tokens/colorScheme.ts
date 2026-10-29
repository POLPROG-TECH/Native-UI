/** Resolved color tokens of one theme (variant, preset and mode). */
export interface ColorScheme {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  /**
   * Text drawn on `primary` fills. Same value as `onPrimary`; kept for
   * backwards compatibility.
   */
  textInverse: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  /**
   * Accent for text and icons on surfaces (links, ghost / secondary button
   * labels, active tabs, selected options). Equals `primary` when that is
   * already readable, otherwise a shade of it that meets `minContrast`.
   */
  primaryText: string;
  /** Feedback colors as readable text on surfaces (see `primaryText`). */
  successText: string;
  warningText: string;
  errorText: string;
  infoText: string;
  /** Text / icon color on a solid `primary` fill (WCAG AA contrast). */
  onPrimary: string;
  success: string;
  successLight: string;
  /** Text / icon color on a solid `success` fill (WCAG AA contrast). */
  onSuccess: string;
  warning: string;
  warningLight: string;
  /** Text / icon color on a solid `warning` fill (WCAG AA contrast). */
  onWarning: string;
  error: string;
  errorLight: string;
  /** Text / icon color on a solid `error` fill (WCAG AA contrast). */
  onError: string;
  info: string;
  /** Text / icon color on a solid `info` fill (WCAG AA contrast). */
  onInfo: string;
  border: string;
  borderLight: string;
  divider: string;
  shadow: string;
  overlay: string;
  /**
   * Neutral for unfilled control tracks (Switch off, ProgressBar track).
   * Reaches 3:1 against surfaces (WCAG 1.4.11, non-text contrast).
   */
  controlTrack: string;
  /** Switch thumb: light in both modes so it stands out on either track. */
  controlThumb: string;
  /** Border that identifies form fields and unchecked boxes, 3:1 against surfaces. */
  controlBorder: string;
  /** Fill of the selected item on a `surfaceSecondary` track (SegmentedControl thumb). */
  surfaceSelected: string;
  /** High-emphasis surface in the opposite tone (dark in light mode), e.g. toasts. */
  inverseSurface: string;
  /** Text and icons on `inverseSurface`. */
  onInverseSurface: string;
  /** Accent as text on `inverseSurface` (toast actions). */
  inversePrimaryText: string;
  chart: readonly string[];
}
