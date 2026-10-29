import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { IconSlot } from '../primitives/iconSlot';
import { PressableScale } from '../primitives/PressableScale';
import { ActionTileBody } from './actionTile/ActionTileBody';
import { useActionTileStyles } from './actionTile/actionTileStyles';
import { useLightHapticPress } from './press/useLightHapticPress';
import type { ActionTileTone } from './actionTile/types';
export type { ActionTileTone } from './actionTile/types';

export interface ActionTileProps {
  /**
   * Icon rendered inside the tinted chip. Prefer a render function, which
   * receives the tone's foreground color (e.g. `primaryText`) and
   * `theme.iconSize.lg`:
   * `icon={({ color, size }) => <SystemIcon name="plus" color={color} size={size} />}`.
   * Nodes render as-is; emoji strings are kept for backwards compatibility.
   */
  icon: IconSlot;
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

/* Disabled tiles give no press feedback. */
const NO_PRESS_SCALE = 1;

/**
 * Compact tappable tile with a tinted icon chip and a label below. Designed for
 * quick-action grids on dashboards and home screens; lay several out in an
 * `HStack` with `flex: 1` each.
 *
 * Press handling is debounced and fires light haptics, matching the other
 * interactive components. Geometry, press scale and debounce window come from
 * `theme.components.actionTile`.
 *
 * @example
 * ```tsx
 * <HStack gap="md">
 *   <ActionTile
 *     icon={({ color, size }) => <SystemIcon name="plus" color={color} size={size} />}
 *     label="Add"
 *     onPress={add}
 *   />
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
  const tokens = useTheme().components.actionTile;
  const handlePress = useLightHapticPress(onPress, tokens.debounceMs);
  const styles = useActionTileStyles(tone, disabled);

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled}
      scaleTo={disabled ? NO_PRESS_SCALE : tokens.pressScale}
      style={[styles.tile, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      {...(testID ? { testID } : {})}
    >
      <ActionTileBody icon={icon} tone={tone} label={label} iconChipStyle={styles.iconChip} />
    </PressableScale>
  );
});
