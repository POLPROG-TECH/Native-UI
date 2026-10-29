import type React from 'react';
import { Text } from '../../primitives/Text';
import { useTheme } from '../../theme';
import type { StatTileSize, StatTileTone } from './types';
import { statTileValueColor, statTileValueVariant } from './statTileValue';

interface StatTileValueProps {
  value: React.ReactNode;
  tone: StatTileTone;
  size: StatTileSize;
  mono: boolean;
}

/** Single-line value that shrinks to fit narrow tiles instead of wrapping. */
export function StatTileValue({ value, tone, size, mono }: StatTileValueProps) {
  const theme = useTheme();
  const tokens = theme.components.statTile;

  return (
    <Text
      variant={statTileValueVariant(size, mono)}
      style={{ color: theme.colors[statTileValueColor(tone)], marginTop: tokens.valueMarginTop }}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={tokens.minimumFontScale}
    >
      {value}
    </Text>
  );
}

export function StatTileCaption({ caption }: { caption: string }) {
  const theme = useTheme();

  return (
    <Text
      variant="caption"
      color="textSecondary"
      style={{ marginTop: theme.components.statTile.captionMarginTop }}
    >
      {caption}
    </Text>
  );
}
