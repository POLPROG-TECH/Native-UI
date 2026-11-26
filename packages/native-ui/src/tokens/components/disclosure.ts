import type { ComponentTokenContext } from './merge';
import type { TypographyVariant } from '../typography';
import type { Elevation } from '../spacing';

/** Navigation and disclosure: Tabs, Accordion, Banner, Tooltip and ActionSheet. */

/** Minimum touch target shared by these components (iOS HIG 44pt). */
const MIN_TOUCH_TARGET = 44;

export interface TabsTokens {
  minHeight: number;
  paddingHorizontal: number;
  gap: number;
  indicatorHeight: number;
  indicatorRadius: number;
  /** Line under the whole tab row. */
  borderWidth: number;
  labelVariant: TypographyVariant;
  /** Selected label and indicator. @default colors.primaryText / colors.primary */
  activeColor: string | undefined;
}

export interface AccordionTokens {
  headerMinHeight: number;
  headerPaddingVertical: number;
  paddingHorizontal: number;
  gap: number;
  contentPaddingBottom: number;
  chevronSize: number;
  titleVariant: TypographyVariant;
  subtitleVariant: TypographyVariant;
  /** Divider under each item. */
  borderWidth: number;
}

export interface BannerTokens {
  padding: number;
  radius: number;
  gap: number;
  /** Width of the accent edge on the leading side. */
  accentWidth: number;
  borderWidth: number;
  iconSize: number;
  dismissIconSize: number;
  dismissHitSlop: number;
  titleVariant: TypographyVariant;
  messageVariant: TypographyVariant;
  actionMarginTop: number;
}

export interface TooltipTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  radius: number;
  offset: number;
  /** Space the bubble keeps from every window edge. */
  edgeInset: number;
  maxWidth: number;
  /** How long the bubble stays after a long press before it hides itself. */
  visibleDurationMs: number;
  elevation: Elevation;
  textVariant: TypographyVariant;
}

export interface ActionSheetTokens {
  itemMinHeight: number;
  itemPaddingHorizontal: number;
  itemGap: number;
  iconSize: number;
  titlePaddingVertical: number;
  cancelMarginTop: number;
  dividerWidth: number;
  labelVariant: TypographyVariant;
  titleVariant: TypographyVariant;
}

export interface DisclosureTokens {
  tabs: TabsTokens;
  accordion: AccordionTokens;
  banner: BannerTokens;
  tooltip: TooltipTokens;
  actionSheet: ActionSheetTokens;
}

export function buildDisclosureTokens({
  spacing,
  borderRadius,
  duration,
}: ComponentTokenContext): DisclosureTokens {
  return {
    tabs: {
      minHeight: MIN_TOUCH_TARGET,
      paddingHorizontal: spacing.md,
      gap: 6,
      indicatorHeight: 2,
      indicatorRadius: 1,
      borderWidth: 1,
      labelVariant: 'label',
      activeColor: undefined,
    },
    accordion: {
      headerMinHeight: MIN_TOUCH_TARGET,
      headerPaddingVertical: spacing.smPlus,
      paddingHorizontal: spacing.md,
      gap: spacing.smPlus,
      contentPaddingBottom: spacing.md,
      chevronSize: spacing.md,
      titleVariant: 'bodyMedium',
      subtitleVariant: 'bodySmall',
      borderWidth: 1,
    },
    banner: {
      padding: spacing.smPlus,
      radius: borderRadius.md,
      gap: spacing.smPlus,
      accentWidth: spacing.xs,
      borderWidth: 1,
      iconSize: spacing.mdPlus,
      dismissIconSize: 14,
      dismissHitSlop: spacing.smPlus,
      titleVariant: 'bodyMedium',
      messageVariant: 'bodySmall',
      actionMarginTop: spacing.sm,
    },
    tooltip: {
      paddingHorizontal: spacing.smPlus,
      paddingVertical: 6,
      radius: borderRadius.xs,
      offset: 6,
      edgeInset: spacing.sm,
      maxWidth: 240,
      visibleDurationMs: duration.slow * 4,
      elevation: 'md',
      textVariant: 'caption',
    },
    actionSheet: {
      itemMinHeight: 52,
      itemPaddingHorizontal: spacing.md,
      itemGap: spacing.smPlus,
      iconSize: spacing.mdPlus,
      titlePaddingVertical: spacing.smPlus,
      cancelMarginTop: spacing.sm,
      dividerWidth: 1,
      labelVariant: 'body',
      titleVariant: 'caption',
    },
  };
}
