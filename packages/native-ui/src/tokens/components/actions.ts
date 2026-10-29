import type { ComponentTokenContext } from './merge';
import type { TypographyVariant } from '../typography';
import type { Elevation } from '../spacing';

/** Buttons, headers, empty states and composite action components. */

export interface ButtonSizeTokens {
  paddingVertical: number;
  paddingHorizontal: number;
  minHeight: number;
}

export interface ButtonTokens {
  sm: ButtonSizeTokens;
  md: ButtonSizeTokens;
  lg: ButtonSizeTokens;
  /** Gap between icon slots and the label. */
  gap: number;
  outlineBorderWidth: number;
  /** Press scale; `1` disables the scale feedback. */
  pressScale: number;
  /** Window in which repeated presses are ignored (double-tap guard). */
  debounceMs: number;
  /** Lines the label may wrap to before truncating. */
  maxLabelLines: number;
}

export type HeaderTitleAlign = 'center' | 'left';

export interface HeaderBarTokens {
  /** Edge of the back button and of the placeholder that balances it. */
  backButtonSize: number;
  backIconSize: number;
  /** Horizontal gap between the title and the side slots. */
  titleGap: number;
  marginBottom: number;
  titleAlign: HeaderTitleAlign;
  regularTitleVariant: TypographyVariant;
  largeTitleVariant: TypographyVariant;
}

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateSizeTokens {
  iconSize: number;
  titleVariant: TypographyVariant;
  messageVariant: TypographyVariant;
  paddingHorizontal: number;
  paddingVertical: number;
  iconMarginBottom: number;
  messageMarginTop: number;
  actionMarginTop: number;
}

export interface EmptyStateTokens {
  sm: EmptyStateSizeTokens;
  md: EmptyStateSizeTokens;
  lg: EmptyStateSizeTokens;
  /** Size used when the `size` prop is omitted. */
  defaultSize: EmptyStateSize;
}

export interface SegmentedControlTokens {
  /** Inset between the track edge and the segments. */
  trackPadding: number;
  trackRadius: number;
  thumbRadius: number;
  segmentPaddingVertical: number;
  segmentPaddingHorizontal: number;
  segmentMinHeight: number;
  /** Gap between a segment's leading node and its label. */
  segmentGap: number;
  labelVariant: TypographyVariant;
  /** Shadow preset of the selected segment. */
  thumbElevation: Elevation;
  /** Track fill; `undefined` uses `colors.surfaceSecondary`. */
  trackColor: string | undefined;
  /** Selected segment fill; `undefined` uses `colors.surfaceSelected`. */
  thumbColor: string | undefined;
}

export interface KeyboardLiftedFooterTokens {
  /**
   * Elevation / zIndex applied while lifted. Android z-orders siblings by
   * elevation, so without it elevated content scrolling behind would draw
   * over the footer.
   */
  liftedElevation: number;
}

export interface FocusRingTokens {
  /** Outline thickness of the keyboard focus indicator. */
  width: number;
  /** Gap between the control edge and the outline. */
  offset: number;
  /** Outline color; `undefined` uses `colors.primaryText`. */
  color: string | undefined;
}

export interface ActionTokens {
  focusRing: FocusRingTokens;
  button: ButtonTokens;
  headerBar: HeaderBarTokens;
  emptyState: EmptyStateTokens;
  segmentedControl: SegmentedControlTokens;
  keyboardLiftedFooter: KeyboardLiftedFooterTokens;
}

export function buildActionTokens({ spacing, borderRadius }: ComponentTokenContext): ActionTokens {
  return {
    focusRing: {
      width: 2,
      offset: 2,
      color: undefined,
    },
    button: {
      sm: { paddingVertical: 7, paddingHorizontal: 14, minHeight: 36 },
      md: { paddingVertical: 13, paddingHorizontal: spacing.mdPlus, minHeight: 48 },
      lg: { paddingVertical: 15, paddingHorizontal: spacing.lg, minHeight: 56 },
      gap: spacing.sm,
      outlineBorderWidth: 1.5,
      pressScale: 0.97,
      debounceMs: 400,
      maxLabelLines: 1,
    },
    headerBar: {
      backButtonSize: 36,
      backIconSize: spacing.mdPlus,
      titleGap: spacing.sm,
      marginBottom: spacing.sm,
      titleAlign: 'center',
      regularTitleVariant: 'title',
      largeTitleVariant: 'heading',
    },
    emptyState: {
      sm: {
        iconSize: spacing.xl,
        titleVariant: 'title',
        messageVariant: 'bodySmall',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        iconMarginBottom: spacing.smPlus,
        messageMarginTop: spacing.xs,
        actionMarginTop: spacing.md,
      },
      md: {
        iconSize: 48,
        titleVariant: 'h3',
        messageVariant: 'body',
        paddingHorizontal: spacing.xl,
        paddingVertical: 48,
        iconMarginBottom: spacing.md,
        messageMarginTop: spacing.sm,
        actionMarginTop: spacing.mdPlus,
      },
      lg: {
        iconSize: 64,
        titleVariant: 'h2',
        messageVariant: 'bodyLarge',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing['3xl'],
        iconMarginBottom: spacing.mdPlus,
        messageMarginTop: spacing.smPlus,
        actionMarginTop: spacing.lg,
      },
      defaultSize: 'md',
    },
    segmentedControl: {
      trackPadding: 3,
      trackRadius: borderRadius.md,
      thumbRadius: borderRadius.sm,
      segmentPaddingVertical: 9,
      segmentPaddingHorizontal: spacing.sm,
      segmentMinHeight: 36,
      segmentGap: 6,
      labelVariant: 'label',
      thumbElevation: 'sm',
      trackColor: undefined,
      thumbColor: undefined,
    },
    keyboardLiftedFooter: {
      liftedElevation: 12,
    },
  };
}
