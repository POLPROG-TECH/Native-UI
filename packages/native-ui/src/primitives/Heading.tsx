import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '../theme';
import { textColorOf, type TextColorToken } from '../tokens/textTokens';

export interface HeadingProps extends TextProps {
  /** Heading level: 1 → h1, 2 → h2, 3 → h3, 'display' → displayLarge, 'displayMedium' → displayMedium */
  level?: 1 | 2 | 3 | 'display' | 'displayMedium';
  /**
   * Color token. Accent and feedback keys resolve to their readable `*Text`
   * variants. (default: 'textPrimary')
   */
  color?: TextColorToken;
  /** Text alignment */
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

const LEVEL_MAP = {
  display: 'displayLarge',
  displayMedium: 'displayMedium',
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const;

/**
 * Heading component with accessible header role.
 *
 * @example
 * ```tsx
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={3} color="textSecondary">Section</Heading>
 * ```
 */
export function Heading({
  level = 1,
  color = 'textPrimary',
  align,
  style,
  children,
  ...rest
}: HeadingProps) {
  const theme = useTheme();
  const variant = LEVEL_MAP[level];

  return (
    <Text
      accessibilityRole="header"
      style={[
        theme.typography[variant],
        {
          color: textColorOf(theme.colors, color),
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
