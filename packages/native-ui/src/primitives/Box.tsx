import React from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import type { Spacing, BorderRadius, Elevation } from '../tokens/spacing';
import type { ColorScheme } from '../tokens/colors';

type ColorToken = keyof ColorScheme;

export interface BoxProps {
  /** Content rendered inside the box. */
  children?: React.ReactNode;
  /** Additional styles merged after token-based styles. */
  style?: StyleProp<ViewStyle>;

  /** Uniform padding using a spacing token (e.g. `'md'`, `'lg'`). */
  p?: Spacing;
  /** Alias for `p`. Convenience for those coming from web CSS. */
  padding?: Spacing;
  /** Horizontal padding using a spacing token. */
  px?: Spacing;
  /** Vertical padding using a spacing token. */
  py?: Spacing;
  /** Uniform margin using a spacing token. */
  m?: Spacing;
  /** Horizontal margin using a spacing token. */
  mx?: Spacing;
  /** Vertical margin using a spacing token. */
  my?: Spacing;

  /** Background color from the theme color token map. */
  bg?: ColorToken;
  /** Border radius from the theme border-radius token map. */
  radius?: BorderRadius;
  /** Alias for `radius`. Convenience for those coming from web CSS. */
  borderRadius?: BorderRadius;
  /** Elevation preset (shadow / Android elevation). */
  elevation?: Elevation;

  /** CSS `flex` shorthand value. */
  flex?: number;

  /** Accessibility role forwarded to the underlying `View`. */
  accessibilityRole?: ViewStyle extends { accessibilityRole?: infer R } ? R : never;
}

/**
 * Low-level layout primitive. A `View` wrapper that accepts token-based
 * spacing, color, radius, and elevation props for consistent styling
 * without writing inline style objects.
 *
 * @example
 * ```tsx
 * <Box p="lg" bg="surface" radius="md" elevation="sm">
 *   <Text>Card-like surface</Text>
 * </Box>
 * <Box px="md" py="sm" flex={1}>
 *   <Text>Flexible content</Text>
 * </Box>
 * ```
 */
export function Box({
  children,
  style,
  p,
  padding,
  px,
  py,
  m,
  mx,
  my,
  bg,
  radius,
  borderRadius,
  elevation: elev,
  flex,
  ...rest
}: BoxProps) {
  const theme = useTheme();

  const computedStyle: ViewStyle = {};

  const resolvedP = p ?? padding;
  const resolvedRadius = radius ?? borderRadius;

  if (resolvedP !== undefined) computedStyle.padding = theme.spacing[resolvedP];

  if (px !== undefined) computedStyle.paddingHorizontal = theme.spacing[px];

  if (py !== undefined) computedStyle.paddingVertical = theme.spacing[py];

  if (m !== undefined) computedStyle.margin = theme.spacing[m];

  if (mx !== undefined) computedStyle.marginHorizontal = theme.spacing[mx];

  if (my !== undefined) computedStyle.marginVertical = theme.spacing[my];

  if (bg !== undefined) computedStyle.backgroundColor = theme.colors[bg] as string;

  if (resolvedRadius !== undefined) computedStyle.borderRadius = theme.borderRadius[resolvedRadius];

  if (flex !== undefined) computedStyle.flex = flex;

  const elevationStyle = elev ? (theme.elevation[elev] as ViewStyle) : undefined;

  return (
    <View style={[computedStyle, elevationStyle, style]} {...rest}>
      {children}
    </View>
  );
}
