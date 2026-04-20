import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme } from '../theme';
import type { ColorScheme } from '../tokens/colors';

type ColorToken = keyof ColorScheme;

export interface HeadingProps extends TextProps {
  /** Heading level: 1 → h1, 2 → h2, 3 → h3, 'display' → displayLarge, 'displayMedium' → displayMedium */
  level?: 1 | 2 | 3 | 'display' | 'displayMedium';
  /** Color token (default: 'textPrimary') */
  color?: ColorToken;
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
          color: theme.colors[color] as string,
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
