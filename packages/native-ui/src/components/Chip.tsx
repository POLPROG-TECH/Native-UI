import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { getContrastText } from '../tokens/colors';
import { type BorderRadius } from '../tokens/spacing';
import { getHaptics } from '../utils/haptics';

export type ChipShape = 'pill' | 'rounded' | 'square';
export type ChipVariant = 'solid' | 'soft' | 'outline';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Leading emoji or text icon */
  icon?: string;
  /** Render prop for a vector icon (e.g. Lucide). Takes precedence over `icon`. */
  renderIcon?: () => React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  /**
   * Controls the chip's corner radius.
   * - `pill` (default): fully rounded capsule, matches most filter UIs.
   * - `rounded`: `borderRadius.lg` corners - a softer, card-like tag.
   * - `square`: `borderRadius.sm` corners - tightest, compact tag.
   * @default 'pill'
   */
  shape?: ChipShape;
  /**
   * Selection visual style.
   * - `solid`   (default): selected = filled with `primary`, bold contrast.
   * - `soft`:   selected = tinted `primaryLight` bg + `primary` text.
   *             Softer on AMOLED and matches DailyForma-style filters.
   * - `outline`: selected = transparent bg + `primary` border + `primary` text.
   * @default 'solid'
   */
  variant?: ChipVariant;
  style?: ViewStyle;
}

const SHAPE_RADIUS: Record<ChipShape, BorderRadius> = {
  pill: 'full',
  rounded: 'lg',
  square: 'sm',
};

/**
 * Selectable chip / filter tag.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  renderIcon,
  disabled = false,
  size = 'md',
  shape = 'pill',
  variant = 'solid',
  style,
}: ChipProps) {
  const theme = useTheme();

  const handlePress = () => {
    getHaptics().light();
    onPress?.();
  };

  const isSmall = size === 'sm';
  const paddingV = isSmall ? theme.spacing['2xs'] : theme.spacing.sm + 2; // 4 / 10
  const paddingH = isSmall ? theme.spacing.sm + theme.spacing['2xs'] * 2 : theme.spacing.md; // 12 / 16

  const borderRadius = theme.borderRadius[SHAPE_RADIUS[shape]];

  const bg = !selected
    ? theme.colors.surfaceSecondary
    : variant === 'soft'
    ? theme.colors.primaryLight
    : variant === 'outline'
    ? 'transparent'
    : theme.colors.primary;

  const borderColor = variant === 'outline' && selected ? theme.colors.primary : 'transparent';

  const labelColor = !selected
    ? theme.colors.textPrimary
    : variant === 'soft' || variant === 'outline'
    ? theme.colors.primary
    : getContrastText(theme.colors.primary);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: bg,
          borderRadius,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
          // Accessibility target: md keeps iOS-recommended 44pt, sm opts into a
          // denser 28pt filter-rail look matching DailyForma's settings/gallery
          // chip pills. 28 is below the raw 44pt AAA target, but the visual
          // reads as a horizontal rocker, not a button, which justifies it.
          minHeight: isSmall ? 28 : 44,
        },
        disabled && { opacity: theme.opacity.disabled },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={theme.opacity.pressed}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
    >
      {renderIcon ? renderIcon() : icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text
        style={[
          isSmall ? theme.typography.labelSmall : theme.typography.label,
          {
            color: labelColor,
            fontWeight: selected ? '600' : '500',
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export interface ChipGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/** Horizontal wrapping container for Chip components. */
export function ChipGroup({ children, style }: ChipGroupProps) {
  return <View style={[styles.group, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
