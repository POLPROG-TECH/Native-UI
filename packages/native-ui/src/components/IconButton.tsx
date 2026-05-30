import React, { useMemo } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';
import { getHaptics } from '../utils/haptics';
import { useDebouncedPress } from '../hooks/useDebouncedPress';

export type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  /** Icon element to render */
  icon: React.ReactNode;
  onPress: () => void;
  /** Accessible label (required for icon-only buttons) */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  /** Test ID for e2e / unit tests. */
  testID?: string;
}

const SIZE_MAP = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;

/**
 * Icon-only pressable button with circular touch target.
 */
export const IconButton = React.memo(function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  testID,
}: IconButtonProps) {
  const theme = useTheme();

  const handlePress = useDebouncedPress(() => {
    getHaptics().light();
    onPress();
  }, 300);

  const containerStyle = useMemo(() => {
    const dim = SIZE_MAP[size];

    const container: ViewStyle[] = [
      styles.base,
      {
        width: dim,
        height: dim,
        borderRadius: dim / 2,
      },
    ];

    switch (variant) {
      case 'primary':
        container.push({ backgroundColor: theme.colors.primaryLight });
        break;
      case 'ghost':
        container.push({ backgroundColor: 'transparent' });
        break;
      case 'danger':
        container.push({ backgroundColor: theme.colors.errorLight });
        break;
      default:
        container.push({ backgroundColor: theme.colors.surfaceSecondary });
    }

    if (disabled) {
      container.push({ opacity: theme.opacity.disabled });
    }

    if (style) {
      container.push(style);
    }

    return container;
  }, [theme, size, variant, disabled, style]);

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled}
      scaleTo={disabled ? 1 : 0.95}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      {...(testID ? { testID } : {})}
      hitSlop={theme.hitSlop.ios}
    >
      {icon}
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
