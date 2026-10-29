import { useMemo, type ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';
import { buildButtonStyles, type ButtonStyles } from './buttonStyles';
import type { ButtonSize, ButtonVariant } from './types';

/** The Button props that affect styling, before defaults are applied. */
export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  glow?: boolean | string;
  renderBackground?: () => ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * Memoized {@link buildButtonStyles} with the Button defaults applied.
 * Depends on each prop rather than the props object so a parent re-render
 * with equal props reuses the same style arrays.
 */
export function useButtonStyles(theme: Theme, props: ButtonStyleProps): ButtonStyles {
  const { variant = 'primary', size = 'md', disabled = false, fullWidth = false } = props;
  const { glow = false, style, labelStyle } = props;
  const hasCustomBackground = Boolean(props.renderBackground);

  return useMemo(
    () =>
      buildButtonStyles(theme, {
        variant,
        size,
        disabled,
        fullWidth,
        glow,
        hasCustomBackground,
        style,
        labelStyle,
      }),
    [theme, variant, size, disabled, fullWidth, glow, hasCustomBackground, style, labelStyle],
  );
}
