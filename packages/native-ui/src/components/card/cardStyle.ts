import type { StyleProp, ViewStyle } from 'react-native';
import type { Theme } from '../../theme/types';
import type { CardProps } from './types';

export type CardStyleOptions = Pick<CardProps, 'size' | 'elevation' | 'padded' | 'style'>;

/** Surface, elevation and density padding for a card, with the caller's style last. */
export function buildCardStyle(
  theme: Theme,
  { size = 'regular', elevation = 'md', padded = true, style }: CardStyleOptions,
): StyleProp<ViewStyle> {
  const tokens = theme.components.card;
  const sizeTokens = tokens[size];

  return [
    {
      backgroundColor: theme.colors.surface,
      borderRadius: sizeTokens.radius,
      borderColor: theme.colors.borderLight,
      borderWidth: tokens.borderWidth,
    },
    theme.elevation[elevation],
    padded ? { padding: sizeTokens.padding } : undefined,
    style,
  ];
}
