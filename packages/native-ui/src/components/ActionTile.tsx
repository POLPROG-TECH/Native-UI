import React, { useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { PressableScale } from '../primitives/PressableScale';
import { getHaptics } from '../utils/haptics';
import { useDebouncedPress } from '../hooks/useDebouncedPress';

export type ActionTileTone = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

export interface ActionTileProps {
  /** Icon element rendered inside the tinted chip. */
  icon: React.ReactNode;
  /** Short label rendered below the icon. */
  label: string;
  onPress: () => void;
  /** Accessible label. Defaults to `label`. */
  accessibilityLabel?: string;
  /**
   * Tint of the icon chip background.
   * @default 'primary'
   */
  tone?: ActionTileTone;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Test ID for e2e / unit tests. */
  testID?: string;
}

const TONE_BG: Record<
  ActionTileTone,
  'primaryLight' | 'successLight' | 'warningLight' | 'errorLight' | 'surfaceSecondary'
> = {
  primary: 'primaryLight',
  success: 'successLight',
  warning: 'warningLight',
  error: 'errorLight',
  neutral: 'surfaceSecondary',
};

/**
 * Compact tappable tile with a tinted icon chip and a label below. Designed for
 * quick-action grids on dashboards and home screens; lay several out in an
 * `HStack` with `flex: 1` each.
 *
 * Press handling is debounced and fires light haptics, matching the other
 * interactive components.
 *
 * @example
 * ```tsx
 * <HStack gap="md">
 *   <ActionTile icon={<Plus />} label="Add" onPress={add} />
 *   <ActionTile icon={<Wallet />} label="Budgets" tone="success" onPress={openBudgets} />
 * </HStack>
 * ```
 */
export const ActionTile = React.memo(function ActionTile({
  icon,
  label,
  onPress,
  accessibilityLabel,
  tone = 'primary',
  disabled = false,
  style,
  testID,
}: ActionTileProps) {
  const theme = useTheme();

  const handlePress = useDebouncedPress(() => {
    getHaptics().light();
    onPress();
  }, 300);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        tile: {
          flex: 1,
          alignItems: 'center',
          gap: theme.spacing.sm,
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.sm,
          borderRadius: theme.borderRadius.lg,
          borderWidth: theme.borderWidth.thin,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          opacity: disabled ? theme.opacity.disabled : 1,
        },
        iconChip: {
          width: 46,
          height: 46,
          borderRadius: 23,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors[TONE_BG[tone]],
        },
      }),
    [theme, tone, disabled],
  );

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled}
      scaleTo={disabled ? 1 : 0.97}
      style={[styles.tile, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      {...(testID ? { testID } : {})}
    >
      <Box style={styles.iconChip}>{icon}</Box>
      <Text variant="labelSmall" color="textPrimary" align="center" numberOfLines={1}>
        {label}
      </Text>
    </PressableScale>
  );
});
