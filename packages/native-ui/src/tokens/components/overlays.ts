import type { DimensionValue } from 'react-native';
import type { ComponentTokenContext } from './merge';

/** How BottomSheet.Footer lays out its actions. */
export type SheetFooterLayout = 'row' | 'fill' | 'stacked';

export interface BottomSheetTokens {
  /** Top corner radius. */
  radius: number;
  /** Sheet fill; `undefined` uses `colors.surface`. */
  backgroundColor: string | undefined;
  /** Upper bound of the sheet height (percent string or points). */
  maxHeight: DimensionValue;
  /**
   * Widest the sheet grows (points). On tablets and web the sheet is centered
   * at this width instead of spanning the screen; phones are narrower, so
   * they keep the full-width sheet.
   */
  maxWidth: number;
  /** Horizontal padding of Header / Body / Footer. */
  paddingHorizontal: number;
  /** Bottom padding used when the safe-area inset is smaller. */
  minBottomPadding: number;
  handleWidth: number;
  handleHeight: number;
  handlePaddingVertical: number;
  headerPaddingTop: number;
  headerPaddingBottom: number;
  bodyPaddingVertical: number;
  footerGap: number;
  footerPaddingTop: number;
  footerPaddingBottom: number;
  /** Default footer layout; `BottomSheet.Footer` can override it per instance. */
  footerLayout: SheetFooterLayout;
  enterDurationMs: number;
  exitDurationMs: number;
  /** Drag distance (points) past which releasing the handle dismisses the sheet. */
  dismissDistance: number;
  /** Downward release velocity (points/ms) that dismisses regardless of distance. */
  dismissVelocity: number;
}

export interface ModalTokens {
  /** Dialog width relative to the window. */
  width: DimensionValue;
  maxWidth: number;
  padding: number;
  radius: number;
  /** Dialog fill; `undefined` uses `colors.surface`. */
  backgroundColor: string | undefined;
  titleMarginBottom: number;
  headerMarginBottom: number;
  bodyMarginVertical: number;
  footerGap: number;
  footerMarginTop: number;
}

export interface SelectTokens {
  containerMarginBottom: number;
  triggerPaddingHorizontal: number;
  triggerPaddingVertical: number;
  triggerMinHeight: number;
  triggerGap: number;
  triggerRadius: number;
  /** Size of the trailing disclosure chevron. */
  chevronSize: number;
  /** Top corner radius of the option sheet (a BottomSheet). */
  sheetRadius: number;
  /** Option list height as a fraction of the window height. */
  listMaxHeightRatio: number;
  optionPaddingHorizontal: number;
  optionPaddingVertical: number;
  optionGap: number;
  optionMinHeight: number;
  /** Size of an option's leading icon and of the selected checkmark. */
  optionIconSize: number;
}

export interface ToastTokens {
  /** Distance from the screen edge, added on top of the safe-area inset. */
  offset: number;
  /** Minimum gap to the screen edge when the safe-area inset is smaller. */
  minEdgeInset: number;
  /** Horizontal margin between the toast and the screen sides. */
  marginHorizontal: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  radius: number;
  accentBorderWidth: number;
  /** Auto-dismiss delay used when `show()` passes no `duration`. */
  durationMs: number;
  /**
   * Multiplier applied to the auto-dismiss delay while a screen reader is
   * running, so the announcement can finish before the toast disappears.
   */
  screenReaderDurationMultiplier: number;
  /**
   * Keep toasts that carry an action on screen until dismissed while a screen
   * reader is running (a timed action is unreachable by swipe navigation).
   */
  stickyActionsWithScreenReader: boolean;
  enterDurationMs: number;
  exitDurationMs: number;
  messageMaxLines: number;
  iconSize: number;
  actionHitSlop: number;
  zIndex: number;
  /**
   * `inverse` draws the toast in the opposite tone (dark in light mode) so it
   * stands out from the content behind it; `surface` uses the elevated card.
   */
  appearance: ToastAppearance;
}

export type ToastAppearance = 'inverse' | 'surface';

export interface OverlayTokens {
  bottomSheet: BottomSheetTokens;
  modal: ModalTokens;
  select: SelectTokens;
  toast: ToastTokens;
}

/* Unchanged from earlier releases so existing apps keep their timing. */
const DEFAULT_TOAST_DURATION_MS = 3000;
const SCREEN_READER_DURATION_MULTIPLIER = 2;

export function buildOverlayTokens({
  spacing,
  borderRadius,
  duration,
}: ComponentTokenContext): OverlayTokens {
  return {
    bottomSheet: {
      radius: borderRadius.xl,
      backgroundColor: undefined,
      maxHeight: '80%',
      maxWidth: 640,
      paddingHorizontal: spacing.mdPlus,
      minBottomPadding: spacing.md,
      handleWidth: 36,
      handleHeight: spacing.xs,
      handlePaddingVertical: 10,
      headerPaddingTop: spacing.xs,
      headerPaddingBottom: spacing.sm,
      bodyPaddingVertical: spacing.sm,
      footerGap: spacing.smPlus,
      footerPaddingTop: spacing.smPlus,
      footerPaddingBottom: spacing.sm,
      footerLayout: 'row',
      enterDurationMs: duration.normal,
      exitDurationMs: duration.fast,
      dismissDistance: 80,
      dismissVelocity: 0.5,
    },
    modal: {
      width: '85%',
      maxWidth: 400,
      padding: spacing.lg,
      radius: borderRadius.xl,
      backgroundColor: undefined,
      titleMarginBottom: spacing.smPlus,
      headerMarginBottom: spacing.smPlus,
      bodyMarginVertical: spacing.xs,
      footerGap: spacing.smPlus,
      footerMarginTop: spacing.mdPlus,
    },
    select: {
      containerMarginBottom: spacing.md,
      triggerPaddingHorizontal: spacing.md,
      triggerPaddingVertical: spacing.smPlus,
      triggerMinHeight: 44,
      triggerGap: spacing.sm,
      triggerRadius: borderRadius.lg,
      chevronSize: spacing.smPlus,
      sheetRadius: borderRadius.xl,
      listMaxHeightRatio: 0.4,
      optionPaddingHorizontal: spacing.mdPlus,
      optionPaddingVertical: 14,
      optionGap: 10,
      optionMinHeight: 48,
      optionIconSize: spacing.md,
    },
    toast: {
      offset: 80,
      minEdgeInset: spacing.md,
      marginHorizontal: spacing.md,
      paddingHorizontal: 14,
      paddingVertical: spacing.smPlus,
      gap: spacing.smPlus,
      radius: borderRadius.md,
      accentBorderWidth: 3,
      durationMs: DEFAULT_TOAST_DURATION_MS,
      screenReaderDurationMultiplier: SCREEN_READER_DURATION_MULTIPLIER,
      stickyActionsWithScreenReader: true,
      enterDurationMs: 250,
      exitDurationMs: duration.fast,
      messageMaxLines: 2,
      iconSize: spacing.mdPlus,
      actionHitSlop: spacing.sm,
      zIndex: 9999,
      appearance: 'inverse',
    },
  };
}
