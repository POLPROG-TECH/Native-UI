import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';
import { getHaptics } from '../utils/haptics';
import { useDebouncedPress } from '../hooks/useDebouncedPress';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** The text label displayed on the button. */
  title: string;
  /** Callback fired when the button is pressed. */
  onPress: () => void;
  /**
   * Visual style variant of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Controls the button height and font size.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * When `true`, the button is visually dimmed and non-interactive.
   * @default false
   */
  disabled?: boolean;
  /**
   * When `true`, replaces the label with a spinner and disables interaction.
   * @default false
   */
  loading?: boolean;
  /** Optional leading icon element rendered before the title. */
  icon?: React.ReactNode;
  /**
   * Render prop alternative to `icon`, rendered to the left of the title.
   * Takes priority over `icon` when both are provided.
   * @example
   * ```tsx
   * <Button title="Add" renderLeft={() => <PlusIcon />} onPress={add} />
   * ```
   */
  renderLeft?: () => React.ReactNode;
  /**
   * Render prop for a trailing element rendered after the title.
   * @example
   * ```tsx
   * <Button title="Next" renderRight={() => <ArrowRight />} onPress={next} />
   * ```
   */
  renderRight?: () => React.ReactNode;
  /**
   * When `true`, the button stretches to fill the width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Adds a themed colored glow (shadow) around the button. Pass `true` to
   * glow with the variant's own accent color (e.g. primary) or a CSS color
   * string for a custom hue. Most useful on primary/destructive CTAs.
   * @default false
   */
  glow?: boolean | string;
  /** Additional styles applied to the outer button container. */
  style?: ViewStyle;
}

/**
 * Primary action button with variant, size, loading state, and icon support.
 * Uses spring-scale press feedback via `PressableScale` and triggers haptic
 * feedback on press. Includes built-in debounce to prevent double taps.
 *
 * Accepts `renderLeft` / `renderRight` render props as alternatives to `icon`.
 * `renderLeft` takes priority over `icon` when both are provided.
 *
 * @example
 * ```tsx
 * <Button title="Save" onPress={handleSave} />
 * <Button title="Delete" variant="danger" loading={isDeleting} />
 * <Button title="Cancel" variant="ghost" size="sm" />
 * <Button title="Sign Up" fullWidth icon={<PlusIcon />} />
 * <Button title="Next" renderRight={() => <ArrowRight />} onPress={next} />
 * ```
 */
export const Button = React.memo(function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  renderLeft,
  renderRight,
  fullWidth = false,
  glow = false,
  style,
}: ButtonProps) {
  const theme = useTheme();

  const handlePress = useDebouncedPress(() => {
    getHaptics().medium();
    onPress();
  }, 400);

  const { containerStyles, textStyles } = useMemo(() => {
    const container: ViewStyle[] = [styles.base, { borderRadius: theme.borderRadius.md }];
    const text: TextStyle[] = [];

    switch (size) {
      case 'sm':
        container.push(SIZE_STYLES.sm);
        text.push(theme.typography.labelSmall);
        break;
      case 'lg':
        container.push(SIZE_STYLES.lg);
        text.push(theme.typography.bodyLarge, LARGE_TEXT_WEIGHT);
        break;
      default:
        container.push(SIZE_STYLES.md);
        text.push(theme.typography.label);
    }

    switch (variant) {
      case 'primary':
        container.push({ backgroundColor: theme.colors.primary });
        text.push({ color: theme.colors.textInverse });
        break;
      case 'secondary':
        container.push({ backgroundColor: theme.colors.primaryLight });
        text.push({ color: theme.colors.primary });
        break;
      case 'outline':
        container.push(OUTLINE_CONTAINER, { borderColor: theme.colors.border });
        text.push({ color: theme.colors.textPrimary });
        break;
      case 'ghost':
        container.push(TRANSPARENT_BG);
        text.push({ color: theme.colors.primary });
        break;
      case 'danger':
      case 'destructive':
        container.push({ backgroundColor: theme.colors.error });
        text.push({ color: theme.colors.textInverse });
        break;
    }

    if (disabled) {
      container.push({ opacity: theme.opacity.disabled });
    }

    if (fullWidth) {
      container.push(FULL_WIDTH_STYLE);
    }

    if (glow && !disabled) {
      container.push(theme.glowShadow(resolveGlowColor(glow, variant, theme)));
    }

    if (style) {
      container.push(style);
    }

    return { containerStyles: container, textStyles: text };
  }, [theme, size, variant, disabled, fullWidth, glow, style]);

  const indicatorColor =
    variant === 'primary' || variant === 'danger' || variant === 'destructive'
      ? theme.colors.textInverse
      : theme.colors.primary;

  const resolvedLeft = renderLeft ? renderLeft() : icon;

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled || loading}
      scaleTo={disabled ? 1 : 0.97}
      style={containerStyles}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} size="small" />
      ) : (
        <View style={styles.content}>
          {resolvedLeft}
          <Text style={textStyles}>{title}</Text>
          {renderRight?.()}
        </View>
      )}
    </PressableScale>
  );
});

const SIZE_STYLES = StyleSheet.create({
  sm: { paddingVertical: 7, paddingHorizontal: 14, minHeight: 36 },
  md: { paddingVertical: 13, paddingHorizontal: 20, minHeight: 48 },
  lg: { paddingVertical: 15, paddingHorizontal: 24, minHeight: 56 },
});

const FULL_WIDTH_STYLE: ViewStyle = { width: '100%' };
const TRANSPARENT_BG: ViewStyle = { backgroundColor: 'transparent' };
const OUTLINE_CONTAINER: ViewStyle = {
  backgroundColor: 'transparent',
  borderWidth: 1.5,
};
const LARGE_TEXT_WEIGHT: TextStyle = { fontWeight: '600' };

/**
 * Pick the glow accent color used by `Button.glow`. Kept out of the render
 * function so the decision is linear and easy to extend with new variants.
 */
function resolveGlowColor(
  glow: NonNullable<ButtonProps['glow']>,
  variant: ButtonVariant,
  theme: ReturnType<typeof useTheme>,
): string {
  if (typeof glow === 'string') return glow;

  if (variant === 'danger' || variant === 'destructive') return theme.colors.error;

  return theme.colors.primary;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
