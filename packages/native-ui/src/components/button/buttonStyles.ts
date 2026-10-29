import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';
import type { ButtonSize, ButtonVariant } from './types';

interface VariantColors {
  background: string;
  label: string;
  border?: string;
}

/** Resolved inputs that decide how a Button looks. */
export interface ButtonStyleOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  fullWidth: boolean;
  glow: boolean | string;
  /** A `renderBackground` fill replaces the variant background color. */
  hasCustomBackground: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export interface ButtonStyles {
  container: StyleProp<ViewStyle>[];
  label: StyleProp<TextStyle>[];
  /** Variant label color, also used to tint the loading spinner. */
  labelColor: string;
}

function variantColors(variant: ButtonVariant, theme: Theme): VariantColors {
  const { colors } = theme;

  switch (variant) {
    case 'secondary':
      return { background: colors.primaryLight, label: colors.primaryText };
    case 'outline':
      return { background: 'transparent', label: colors.textPrimary, border: colors.border };
    case 'ghost':
      return { background: 'transparent', label: colors.primaryText };
    case 'danger':
      return { background: colors.error, label: colors.onError };
    case 'primary':
    default:
      return { background: colors.primary, label: colors.onPrimary };
  }
}

function labelTypography(size: ButtonSize, theme: Theme): TextStyle {
  switch (size) {
    case 'sm':
      return theme.typography.labelSmall;
    case 'lg':
      return { ...theme.typography.bodyLarge, fontWeight: '600' };
    case 'md':
    default:
      return theme.typography.label;
  }
}

/** Glow accent: an explicit color wins, otherwise the variant's accent. */
export function resolveGlowColor(
  glow: true | string,
  variant: ButtonVariant,
  theme: Theme,
): string {
  if (typeof glow === 'string') {
    return glow;
  }

  if (variant === 'danger') {
    return theme.colors.error;
  }

  return theme.colors.primary;
}

function sizedContainerStyle(
  theme: Theme,
  options: ButtonStyleOptions,
  palette: VariantColors,
): ViewStyle {
  const sizeTokens = theme.components.button[options.size];

  return {
    borderRadius: theme.borderRadius.md,
    paddingVertical: sizeTokens.paddingVertical,
    paddingHorizontal: sizeTokens.paddingHorizontal,
    minHeight: sizeTokens.minHeight,
    backgroundColor: options.hasCustomBackground ? 'transparent' : palette.background,
  };
}

/** State-dependent container styles, in the order they must override each other. */
function containerModifiers(
  theme: Theme,
  options: ButtonStyleOptions,
  palette: VariantColors,
): StyleProp<ViewStyle>[] {
  const modifiers: StyleProp<ViewStyle>[] = [];

  if (palette.border) {
    modifiers.push({
      borderWidth: theme.components.button.outlineBorderWidth,
      borderColor: palette.border,
    });
  }

  if (options.hasCustomBackground) {
    modifiers.push(styles.clip);
  }

  if (options.disabled) {
    modifiers.push({ opacity: theme.opacity.disabled });
  }

  if (options.fullWidth) {
    modifiers.push(styles.fullWidth);
  }

  if (options.glow && !options.disabled) {
    modifiers.push(theme.glowShadow(resolveGlowColor(options.glow, options.variant, theme)));
  }

  return modifiers;
}

/**
 * Builds the container and label style arrays for a Button. Caller styles
 * (`style`, `labelStyle`) come last so they override every themed value.
 */
export function buildButtonStyles(theme: Theme, options: ButtonStyleOptions): ButtonStyles {
  const palette = variantColors(options.variant, theme);

  return {
    container: [
      styles.base,
      sizedContainerStyle(theme, options, palette),
      ...containerModifiers(theme, options, palette),
      options.style,
    ],
    label: [labelTypography(options.size, theme), { color: palette.label }, options.labelStyle],
    labelColor: palette.label,
  };
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clip: {
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
});
