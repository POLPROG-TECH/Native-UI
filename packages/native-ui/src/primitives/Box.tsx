import React from 'react';
import { View, type ViewStyle, type ViewProps, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import type { Spacing, BorderRadius, Elevation } from '../tokens/spacing';
import { buildSurfaceStyle, takeSurfaceTokens, type ColorToken } from './surfaceTokens';

export interface BoxProps extends Omit<ViewProps, 'style'> {
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
export function Box({ children, style, padding, borderRadius, elevation, ...props }: BoxProps) {
  const theme = useTheme();
  const { tokens, rest } = takeSurfaceTokens(props);
  const surfaceStyle = buildSurfaceStyle(theme, {
    ...tokens,
    p: tokens.p ?? padding,
    radius: tokens.radius ?? borderRadius,
  });
  const elevationStyle = elevation ? theme.elevation[elevation] : undefined;

  return (
    <View style={[surfaceStyle, elevationStyle, style]} {...rest}>
      {children}
    </View>
  );
}
