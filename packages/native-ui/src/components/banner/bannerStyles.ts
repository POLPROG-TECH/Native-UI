import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { SystemIconName } from '../../primitives/SystemIcon';
import type { Theme } from '../../theme/types';

export const BANNER_VARIANTS = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

export type BannerVariant = (typeof BANNER_VARIANTS)[keyof typeof BANNER_VARIANTS];

const VARIANT_GLYPH: Record<BannerVariant, SystemIconName> = {
  info: 'info',
  success: 'check',
  warning: 'alert',
  error: 'alert',
};

export function bannerGlyph(variant: BannerVariant): SystemIconName {
  return VARIANT_GLYPH[variant];
}

/** Icon color: the variant's readable text shade, so it meets contrast on the surface. */
export function bannerInk(theme: Theme, variant: BannerVariant): string {
  return theme.colors[`${variant}Text`];
}

/** Card with a variant-colored edge on the leading side (mirrors in RTL). */
export function buildBannerStyle(
  theme: Theme,
  variant: BannerVariant,
  style: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  const tokens = theme.components.banner;

  return [
    styles.row,
    {
      gap: tokens.gap,
      padding: tokens.padding,
      borderRadius: tokens.radius,
      borderWidth: tokens.borderWidth,
      borderColor: theme.colors.border,
      borderStartWidth: tokens.accentWidth,
      borderStartColor: theme.colors[variant],
      backgroundColor: theme.colors.surface,
    },
    style,
  ];
}

export function buildTitleStyle(theme: Theme): TextStyle {
  return {
    ...theme.typography[theme.components.banner.titleVariant],
    color: theme.colors.textPrimary,
  };
}

/** A message under a title is secondary; a message on its own carries the banner. */
export function buildMessageStyle(theme: Theme, hasTitle: boolean): TextStyle {
  return {
    ...theme.typography[theme.components.banner.messageVariant],
    color: hasTitle ? theme.colors.textSecondary : theme.colors.textPrimary,
  };
}

export function buildActionLabelStyle(theme: Theme): TextStyle {
  return { ...theme.typography.label, color: theme.colors.primaryText };
}

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  body: {
    flex: 1,
  },
  action: {
    alignSelf: 'flex-start',
  },
});
