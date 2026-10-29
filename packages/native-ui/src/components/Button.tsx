import React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';
import { ButtonContent } from './button/ButtonContent';
import { useButtonPress } from './button/useButtonPress';
import { useButtonStyles } from './button/useButtonStyles';
import type { ButtonHaptic, ButtonSize, ButtonVariant } from './button/types';

export type { ButtonHaptic, ButtonSize, ButtonVariant } from './button/types';

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
   * When `true`, replaces the label with a spinner, disables interaction and
   * reports `busy` to screen readers. The button keeps its width.
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
   * Render prop for a custom fill drawn behind the content and clipped to the
   * button shape, e.g. a gradient. Replaces the variant's background color;
   * pair it with `labelStyle` if the label color must change too.
   * @example
   * ```tsx
   * <Button title="Save" renderBackground={() => <GradientBox colors={brand} />} onPress={save} />
   * ```
   */
  renderBackground?: () => React.ReactNode;
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
  /**
   * Haptic played on press (see `configureHaptics`).
   * @default 'medium'
   */
  haptic?: ButtonHaptic;
  /**
   * Maximum label lines before truncation.
   * @default theme.components.button.maxLabelLines (1)
   */
  numberOfLines?: number;
  /** Screen-reader name. @default title */
  accessibilityLabel?: string;
  /** Screen-reader hint describing the result of the press. */
  accessibilityHint?: string;
  /** Additional styles applied to the outer button container. */
  style?: StyleProp<ViewStyle>;
  /** Additional styles applied to the label. */
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Primary action button with variant, size, loading state, and icon support.
 * Uses spring-scale press feedback via `PressableScale`, plays a configurable
 * haptic and ignores repeat presses within `components.button.debounceMs`.
 * All dimensions come from `theme.components.button`.
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
export const Button = React.memo(function Button(props: ButtonProps) {
  const { title, disabled = false, loading = false, haptic = 'medium' } = props;
  const theme = useTheme();
  const tokens = theme.components.button;
  const handlePress = useButtonPress(props.onPress, haptic, tokens.debounceMs);
  const styles = useButtonStyles(theme, props);
  const isInteractive = !disabled && !loading;

  return (
    <PressableScale
      testID={props.testID}
      onPress={handlePress}
      disabled={!isInteractive}
      scaleTo={isInteractive ? tokens.pressScale : 1}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? title}
      accessibilityHint={props.accessibilityHint}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
    >
      <ButtonContent
        content={props}
        loading={loading}
        labelStyle={styles.label}
        spinnerColor={styles.labelColor}
      />
    </PressableScale>
  );
});
