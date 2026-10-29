import { useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme/types';
import type { IconButtonSize, IconButtonVariant } from './types';

export interface IconButtonStyleOptions {
  size: IconButtonSize;
  variant: IconButtonVariant;
  disabled: boolean;
  style?: StyleProp<ViewStyle>;
}

const layout = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function variantBackground(theme: Theme, variant: IconButtonVariant): string {
  switch (variant) {
    case 'primary':
      return theme.colors.primaryLight;
    case 'ghost':
      return 'transparent';
    case 'danger':
      return theme.colors.errorLight;
    case 'default':
      return theme.colors.surfaceSecondary;
  }
}

/** Circular container sized by `theme.components.iconButton[size]`, caller style last. */
export function buildIconButtonStyle(
  theme: Theme,
  { size, variant, disabled, style }: IconButtonStyleOptions,
): StyleProp<ViewStyle>[] {
  const dim = theme.components.iconButton[size];
  const container: StyleProp<ViewStyle>[] = [
    layout.base,
    { width: dim, height: dim, borderRadius: dim / 2 },
    { backgroundColor: variantBackground(theme, variant) },
  ];

  if (disabled) {
    container.push({ opacity: theme.opacity.disabled });
  }

  container.push(style);

  return container;
}

/** Memoized container style; recomputed only when an input changes. */
export function useIconButtonStyle({
  size,
  variant,
  disabled,
  style,
}: IconButtonStyleOptions): StyleProp<ViewStyle>[] {
  const theme = useTheme();

  return useMemo(
    () => buildIconButtonStyle(theme, { size, variant, disabled, style }),
    [theme, size, variant, disabled, style],
  );
}
