import React from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import type { Spacing, BorderRadius, Elevation } from '../tokens/spacing';
import type { ColorScheme } from '../tokens/colors';

type ColorToken = Exclude<keyof ColorScheme, 'chart'>;

export interface StackBaseProps extends Omit<ViewProps, 'style'> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Gap between children, using spacing tokens */
  gap?: Spacing;
  /** Alias for `gap`. Common across design systems. */
  spacing?: Spacing;
  /** Alignment of children on the cross axis */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /** Alignment of children on the main axis */
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  /** Flex value */
  flex?: number;
  /** Allow wrapping */
  wrap?: boolean;

  /** Uniform padding using a spacing token. */
  p?: Spacing;
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
  /** Elevation preset (shadow / Android elevation). */
  elevation?: Elevation;
}

export type VStackProps = StackBaseProps;
export type HStackProps = StackBaseProps;

function useStackStyle({
  gap,
  spacing,
  align,
  justify,
  flex,
  wrap,
  p,
  px,
  py,
  m,
  mx,
  my,
  bg,
  radius,
  elevation: elev,
}: Omit<StackBaseProps, 'children' | 'style'>): ViewStyle {
  const theme = useTheme();
  const s: ViewStyle = {};

  const resolvedGap = gap ?? spacing;
  if (resolvedGap) s.gap = theme.spacing[resolvedGap];
  if (align) s.alignItems = align;
  if (justify) s.justifyContent = justify;
  if (flex !== undefined) s.flex = flex;
  if (wrap) s.flexWrap = 'wrap';

  if (p !== undefined) s.padding = theme.spacing[p];
  if (px !== undefined) s.paddingHorizontal = theme.spacing[px];
  if (py !== undefined) s.paddingVertical = theme.spacing[py];
  if (m !== undefined) s.margin = theme.spacing[m];
  if (mx !== undefined) s.marginHorizontal = theme.spacing[mx];
  if (my !== undefined) s.marginVertical = theme.spacing[my];
  if (bg !== undefined) s.backgroundColor = theme.colors[bg];
  if (radius !== undefined) s.borderRadius = theme.borderRadius[radius];

  if (elev) Object.assign(s, theme.elevation[elev]);

  return s;
}

/** Vertical stack - lays children out top to bottom */
export function VStack({
  children,
  style,
  gap,
  spacing,
  align,
  justify,
  flex,
  wrap,
  p,
  px,
  py,
  m,
  mx,
  my,
  bg,
  radius,
  elevation,
  ...rest
}: VStackProps) {
  const computed = useStackStyle({
    gap,
    spacing,
    align,
    justify,
    flex,
    wrap,
    p,
    px,
    py,
    m,
    mx,
    my,
    bg,
    radius,
    elevation,
  });

  return (
    <View style={[{ flexDirection: 'column' }, computed, style]} {...rest}>
      {children}
    </View>
  );
}

/** Horizontal stack - lays children out left to right */
export function HStack({
  children,
  style,
  gap,
  spacing,
  align = 'center',
  justify,
  flex,
  wrap,
  p,
  px,
  py,
  m,
  mx,
  my,
  bg,
  radius,
  elevation,
  ...rest
}: HStackProps) {
  const computed = useStackStyle({
    gap,
    spacing,
    align,
    justify,
    flex,
    wrap,
    p,
    px,
    py,
    m,
    mx,
    my,
    bg,
    radius,
    elevation,
  });

  return (
    <View style={[{ flexDirection: 'row' }, computed, style]} {...rest}>
      {children}
    </View>
  );
}
