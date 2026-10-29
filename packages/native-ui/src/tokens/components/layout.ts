import { borderWidth } from '../spacing';
import type { ComponentTokenContext } from './merge';
import { buildListTokens, type ListTokens } from './lists';
import { buildDisplayTokens, type DisplayTokens } from './display';

/**
 * Layout, list, navigation and motion primitives. Each entry holds every
 * dimension the component would otherwise hardcode; see
 * `NativeUIConfig.components`. List rows live in `lists.ts`, display and
 * motion primitives in `display.ts`; this file aggregates them.
 */

export interface PressableTokens {
  /** Scale applied while pressed when no `scaleTo` prop is given. */
  scaleTo: number;
  springDamping: number;
  springStiffness: number;
}

export interface CardSizeTokens {
  padding: number;
  radius: number;
}

export interface CardTokens {
  compact: CardSizeTokens;
  regular: CardSizeTokens;
  spacious: CardSizeTokens;
  borderWidth: number;
  /** Press scale of pressable cards; `1` disables the scale feedback. */
  pressScale: number;
  /** Extra touch area added on every side of pressable cards. */
  hitSlop: number;
}

export interface SectionTokens {
  paddingHorizontal: number;
  marginBottom: number;
  headerMarginBottom: number;
}

export interface StatTileTokens {
  valueMarginTop: number;
  captionMarginTop: number;
  /** Smallest scale the value text may shrink to before truncating. */
  minimumFontScale: number;
}

export interface ActionTileTokens {
  paddingVertical: number;
  paddingHorizontal: number;
  /** Space between the icon chip and the label. */
  gap: number;
  radius: number;
  /** Edge length of the round icon chip; its radius is half of it. */
  iconChipSize: number;
  /** Press scale; `1` disables the scale feedback. */
  pressScale: number;
  /** Window in which repeated presses are ignored (double-tap guard). */
  debounceMs: number;
}

export interface BottomTabBarTokens {
  /** Size passed to each item's `icon` renderer. */
  iconSize: number;
  /** Box the icon (and its badge anchor) is centred in. */
  iconWrapSize: number;
  /** Numeric badges above this render as `${maxNumericBadge}+`. */
  maxNumericBadge: number;
  hitSlop: number;
  paddingTop: number;
  /** Bottom padding added on top of `safeBottomInset` on iOS. */
  paddingBottomIos: number;
  /** Bottom padding added on top of `safeBottomInset` on Android and web. */
  paddingBottomAndroid: number;
  itemPaddingVertical: number;
  /** Minimum tap target height of each tab. */
  itemMinHeight: number;
  labelFontSize: number;
  labelMarginTop: number;
  labelLetterSpacing: number;
  /** Height and minimum width of the badge pill; its radius is half of it. */
  badgeSize: number;
  /** Badge offset from the top edge of the icon box (negative overhangs it). */
  badgeOffsetTop: number;
  /** Badge offset from the end edge of the icon box (negative overhangs it). */
  badgeOffsetEnd: number;
  badgePaddingHorizontal: number;
  badgeFontSize: number;
  badgeLineHeight: number;
  /**
   * Active tab indicator. `'pill'` draws a Material 3 style pill behind the
   * active icon, because a tinted 10 pt label alone is too faint a cue (emoji
   * icons cannot be tinted at all). `'none'` keeps the label-only look.
   */
  indicator: 'pill' | 'none';
  indicatorWidth: number;
  indicatorHeight: number;
  indicatorRadius: number;
  /**
   * Pill fill; `undefined` uses `colors.primaryLight`, which the active
   * `primaryText` tint is guaranteed to be readable on. A custom fill must
   * keep that contrast.
   */
  indicatorColor: string | undefined;
  /** Width and opacity transition of the pill; skipped with `reduceAnimations`. */
  indicatorDurationMs: number;
}

export interface ScreenContainerTokens {
  /** Horizontal padding applied when `padded` is true. */
  paddingHorizontal: number;
  /**
   * Content width cap. On windows wider than this, content is centred and
   * limited to this width (tablet layout).
   */
  maxContentWidth: number;
}

export interface CountdownTokens {
  /** Re-render interval used when no `tickMs` prop is given. */
  tickMs: number;
}

export interface LayoutTokens extends ListTokens, DisplayTokens {
  pressable: PressableTokens;
  card: CardTokens;
  section: SectionTokens;
  statTile: StatTileTokens;
  actionTile: ActionTileTokens;
  bottomTabBar: BottomTabBarTokens;
  screenContainer: ScreenContainerTokens;
  countdown: CountdownTokens;
}

/* Unchanged from earlier releases so existing layouts keep their geometry. */
const SCREEN_MAX_CONTENT_WIDTH = 768;
const MS_PER_SECOND = 1000;

export function buildLayoutTokens(context: ComponentTokenContext): LayoutTokens {
  const { spacing, borderRadius, duration } = context;

  return {
    ...buildListTokens(context),
    ...buildDisplayTokens(context),
    pressable: {
      scaleTo: 0.97,
      springDamping: 15,
      springStiffness: 400,
    },
    card: {
      compact: { padding: spacing.md, radius: borderRadius.md },
      regular: { padding: spacing.lg, radius: borderRadius.lg },
      spacious: { padding: spacing.xl, radius: borderRadius.lg },
      borderWidth: borderWidth.hairline,
      pressScale: 0.98,
      hitSlop: spacing.xs,
    },
    section: {
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
      headerMarginBottom: spacing.smPlus,
    },
    statTile: {
      valueMarginTop: spacing['2xs'],
      captionMarginTop: spacing['2xs'],
      minimumFontScale: 0.7,
    },
    actionTile: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.sm,
      gap: spacing.sm,
      radius: borderRadius.lg,
      iconChipSize: 46,
      pressScale: 0.97,
      debounceMs: duration.normal,
    },
    bottomTabBar: {
      iconSize: 22,
      iconWrapSize: 26,
      maxNumericBadge: 99,
      hitSlop: spacing.sm,
      paddingTop: spacing.xs,
      paddingBottomIos: spacing.xs,
      paddingBottomAndroid: spacing.sm,
      itemPaddingVertical: spacing.xs,
      itemMinHeight: 44,
      labelFontSize: 10,
      labelMarginTop: 1,
      labelLetterSpacing: 0.1,
      badgeSize: spacing.md,
      badgeOffsetTop: -spacing.xs,
      badgeOffsetEnd: -spacing.sm,
      badgePaddingHorizontal: spacing.xs,
      badgeFontSize: 10,
      badgeLineHeight: spacing.smPlus,
      indicator: 'pill',
      indicatorWidth: spacing['3xl'],
      indicatorHeight: spacing.xl,
      indicatorRadius: borderRadius.full,
      indicatorColor: undefined,
      indicatorDurationMs: duration.fast,
    },
    screenContainer: {
      paddingHorizontal: spacing.lg,
      maxContentWidth: SCREEN_MAX_CONTENT_WIDTH,
    },
    countdown: {
      tickMs: MS_PER_SECOND,
    },
  };
}

export type * from './lists';
export type * from './display';
