import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme } from '../theme';
import type { TypographyVariant } from '../tokens/typography';
import type { ColorScheme } from '../tokens/colors';

/** Color tokens safe to use for text (excludes composite tokens like `chart`). */
type ColorToken = Exclude<keyof ColorScheme, 'chart'>;

export interface TextProps extends RNTextProps {
  /**
   * Typography preset controlling font size, weight, and line height.
   * @default 'body'
   */
  variant?: TypographyVariant;
  /**
   * Theme color token applied as the text color.
   * @default 'textPrimary'
   */
  color?: ColorToken;
  /** Horizontal text alignment. */
  align?: TextStyle['textAlign'];
  /** Content to render. */
  children: React.ReactNode;
}

/**
 * Typography primitive. Renders text using theme tokens.
 *
 * @example
 * ```tsx
 * <Text variant="h2" color="primary">Hello</Text>
 * <Text variant="caption" color="textSecondary">Subtitle</Text>
 * ```
 */
export function Text({
  variant = 'body',
  color = 'textPrimary',
  align,
  style,
  children,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const base = theme.typography[variant];

  return (
    <RNText
      style={[
        base,
        theme.fontScale
          ? {
              fontSize: base.fontSize + theme.fontScale,
              lineHeight: base.lineHeight + theme.fontScale,
            }
          : null,
        {
          color: theme.colors[color],
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
