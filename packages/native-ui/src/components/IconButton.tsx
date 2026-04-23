import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';
import { getHaptics } from '../utils/haptics';

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
export function IconButton({
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
  const pressedRef = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handlePress = useCallback(() => {
    if (pressedRef.current) return;

    pressedRef.current = true;
    try {
      getHaptics().light();
      onPress();
    } finally {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

      resetTimerRef.current = setTimeout(() => {
        pressedRef.current = false;
        resetTimerRef.current = null;
      }, 300);
    }
  }, [onPress]);

  const dim = SIZE_MAP[size];

  const containerStyle: ViewStyle[] = [
    styles.base,
    {
      width: dim,
      height: dim,
      borderRadius: dim / 2,
    },
  ];

  switch (variant) {
    case 'primary':
      containerStyle.push({ backgroundColor: theme.colors.primaryLight });
      break;
    case 'ghost':
      containerStyle.push({ backgroundColor: 'transparent' });
      break;
    case 'danger':
      containerStyle.push({ backgroundColor: theme.colors.errorLight });
      break;
    default:
      containerStyle.push({ backgroundColor: theme.colors.surfaceSecondary });
  }

  if (disabled) {
    containerStyle.push({ opacity: theme.opacity.disabled });
  }

  if (style) {
    containerStyle.push(style);
  }

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
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
