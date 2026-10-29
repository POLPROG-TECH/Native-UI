import React from 'react';
import { View, type ViewProps, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import type { Theme } from '../theme/types';
import type { Spacing, BorderRadius, Elevation } from '../tokens/spacing';
import type { Mutable } from '../utils/types';
import { buildSurfaceStyle, takeSurfaceTokens, type ColorToken } from './surfaceTokens';

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
    'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
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

type StackFlexProps = Pick<StackBaseProps, 'gap' | 'spacing' | 'align' | 'justify' | 'wrap'>;

function buildStackFlexStyle(theme: Theme, props: StackFlexProps): Mutable<ViewStyle> {
  const style: Mutable<ViewStyle> = {};
  const resolvedGap = props.gap ?? props.spacing;

  if (resolvedGap) {
    style.gap = theme.spacing[resolvedGap];
  }

  if (props.align) {
    style.alignItems = props.align;
  }

  if (props.justify) {
    style.justifyContent = props.justify;
  }

  if (props.wrap) {
    style.flexWrap = 'wrap';
  }

  return style;
}

/** Resolves the stack's token props to one style and returns the View props left over. */
function useStackLayout(props: Omit<StackBaseProps, 'children' | 'style'>) {
  const theme = useTheme();
  const { gap, spacing, align, justify, wrap, elevation, ...others } = props;
  const { tokens, rest } = takeSurfaceTokens(others);
  const layoutStyle: ViewStyle = {
    ...buildSurfaceStyle(theme, tokens),
    ...buildStackFlexStyle(theme, { gap, spacing, align, justify, wrap }),
    ...(elevation ? theme.elevation[elevation] : undefined),
  };

  return { layoutStyle, rest };
}

/** Vertical stack - lays children out top to bottom */
export function VStack({ children, style, ...props }: VStackProps) {
  const { layoutStyle, rest } = useStackLayout(props);

  return (
    <View style={[{ flexDirection: 'column' }, layoutStyle, style]} {...rest}>
      {children}
    </View>
  );
}

/** Horizontal stack - lays children out left to right */
export function HStack({ children, style, align = 'center', ...props }: HStackProps) {
  const { layoutStyle, rest } = useStackLayout({ ...props, align });

  return (
    <View style={[{ flexDirection: 'row' }, layoutStyle, style]} {...rest}>
      {children}
    </View>
  );
}
