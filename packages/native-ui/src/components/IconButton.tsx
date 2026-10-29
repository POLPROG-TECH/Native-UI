import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { PressableScale } from '../primitives/PressableScale';
import { useIconButtonStyle } from './iconButton/iconButtonStyle';
import { useLightHapticPress } from './press/useLightHapticPress';
import type { IconButtonVariant, IconButtonSize } from './iconButton/types';
export type { IconButtonVariant, IconButtonSize } from './iconButton/types';

export interface IconButtonProps {
  /** Icon element to render */
  icon: React.ReactNode;
  onPress: () => void;
  /** Accessible label (required for icon-only buttons) */
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Test ID for e2e / unit tests. */
  testID?: string;
}

/* Disabled buttons give no press feedback. */
const NO_PRESS_SCALE = 1;

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
  const tokens = theme.components.iconButton;
  const handlePress = useLightHapticPress(onPress, tokens.debounceMs);
  const containerStyle = useIconButtonStyle({ size, variant, disabled, style });

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled}
      scaleTo={disabled ? NO_PRESS_SCALE : tokens.pressScale}
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
