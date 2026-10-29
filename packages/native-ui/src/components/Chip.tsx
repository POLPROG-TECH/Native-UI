import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useFocusRing } from '../hooks/useFocusRing';
import { renderIconSlot, type IconSlot } from '../primitives/iconSlot';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import { type BorderRadius } from '../tokens/spacing';
import { getHaptics } from '../utils/haptics';
import { resolveChipColors, type ChipColors } from './chip/chipColors';
import type { ChipVariant } from './chip/types';
export type { ChipVariant } from './chip/types';

export type ChipShape = 'pill' | 'rounded' | 'square';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /**
   * Leading icon. Prefer a render function, which receives the chip's label
   * color (so it follows selection) and `theme.components.chip.iconFontSize`:
   * `icon={({ color, size }) => <SystemIcon name="check" color={color} size={size} />}`.
   * Nodes render as-is; emoji / text strings are kept for backwards
   * compatibility.
   */
  icon?: IconSlot;
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
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SHAPE_RADIUS: Record<ChipShape, BorderRadius> = {
  pill: 'full',
  rounded: 'lg',
  square: 'sm',
};

interface ChipBoxOptions {
  variant: ChipVariant;
  size: 'sm' | 'md';
  shape: ChipShape;
  disabled: boolean;
  colors: ChipColors;
}

function buildChipStyle(
  theme: Theme,
  { variant, size, shape, disabled, colors }: ChipBoxOptions,
  style: StyleProp<ViewStyle>,
): StyleProp<ViewStyle> {
  const tokens = theme.components.chip;
  const sizeTokens = tokens[size];

  return [
    styles.chip,
    {
      backgroundColor: colors.background,
      borderRadius: theme.borderRadius[SHAPE_RADIUS[shape]],
      borderWidth: variant === 'outline' ? tokens.outlineBorderWidth : 0,
      borderColor: colors.border,
      gap: tokens.gap,
      /*
       * md keeps the 44pt touch target; see `ChipTokens.sm` for why the
       * small size is allowed to go below it.
       */
      paddingVertical: sizeTokens.paddingVertical,
      paddingHorizontal: sizeTokens.paddingHorizontal,
      minHeight: sizeTokens.minHeight,
    },
    disabled && { opacity: theme.opacity.disabled },
    style,
  ];
}

interface ChipLeadingIconProps extends Pick<ChipProps, 'icon' | 'renderIcon'> {
  color: string;
}

/** `renderIcon` wins over `icon`; renders nothing when neither is set. */
function ChipLeadingIcon({ icon, renderIcon, color }: ChipLeadingIconProps) {
  const theme = useTheme();

  if (renderIcon) {
    return <>{renderIcon()}</>;
  }

  if (!icon) {
    return null;
  }

  return <>{renderIconSlot(icon, { color, size: theme.components.chip.iconFontSize })}</>;
}

interface ChipLabelProps {
  label: string;
  size: 'sm' | 'md';
  selected: boolean;
  color: string;
}

function ChipLabel({ label, size, selected, color }: ChipLabelProps) {
  const theme = useTheme();
  const typography = size === 'sm' ? theme.typography.labelSmall : theme.typography.label;

  return (
    <Text style={[typography, { color, fontWeight: selected ? '600' : '500' }]} numberOfLines={1}>
      {label}
    </Text>
  );
}

/** Applies the prop defaults and derives the press handler and resolved styles. */
function useChipState({
  selected = false,
  onPress,
  disabled = false,
  size = 'md',
  shape = 'pill',
  variant = 'solid',
  style,
}: ChipProps) {
  const theme = useTheme();
  const colors = resolveChipColors(theme, variant, selected);

  const handlePress = useCallback(() => {
    getHaptics().light();
    onPress?.();
  }, [onPress]);

  return {
    selected,
    disabled,
    size,
    handlePress,
    labelColor: colors.label,
    activeOpacity: theme.opacity.pressed,
    containerStyle: buildChipStyle(theme, { variant, size, shape, disabled, colors }, style),
  };
}

/**
 * Selectable chip / filter tag with a themed keyboard focus ring.
 */
export function Chip(props: ChipProps) {
  const { label, icon, renderIcon, testID } = props;
  const chip = useChipState(props);
  const { focusProps, focusRingStyle } = useFocusRing();

  return (
    <TouchableOpacity
      {...focusProps}
      testID={testID}
      style={[chip.containerStyle, focusRingStyle]}
      onPress={chip.handlePress}
      disabled={chip.disabled}
      activeOpacity={chip.activeOpacity}
      accessibilityRole="button"
      accessibilityState={{ selected: chip.selected, disabled: chip.disabled }}
      accessibilityLabel={label}
    >
      <ChipLeadingIcon icon={icon} renderIcon={renderIcon} color={chip.labelColor} />
      <ChipLabel label={label} size={chip.size} selected={chip.selected} color={chip.labelColor} />
    </TouchableOpacity>
  );
}

export interface ChipGroupProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Horizontal wrapping container for Chip components. */
export function ChipGroup({ children, style, testID }: ChipGroupProps) {
  const theme = useTheme();

  return (
    <View testID={testID} style={[styles.group, { gap: theme.components.chip.groupGap }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  group: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
