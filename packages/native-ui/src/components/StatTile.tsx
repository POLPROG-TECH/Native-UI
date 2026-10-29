import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../primitives/Text';
import { StatTileCaption, StatTileValue } from './statTile/StatTileParts';
import type { StatTileTone, StatTileSize } from './statTile/types';
export type { StatTileTone, StatTileSize } from './statTile/types';

export interface StatTileProps {
  /** Uppercase label rendered above the value (e.g. "TIME", "SCORE"). */
  label: string;
  /** Primary value - typically a short numeric string ("01:24", "358"). */
  value: React.ReactNode;
  /** Optional subtitle rendered below the value (e.g. "best: 02:13"). */
  caption?: string;
  /**
   * Visual tone. Controls the value color.
   * @default 'neutral'
   */
  tone?: StatTileTone;
  /**
   * Size preset. Affects label/value typography.
   * @default 'md'
   */
  size?: StatTileSize;
  /**
   * Text alignment.
   * @default 'center'
   */
  align?: 'left' | 'center';
  /** Whether the value uses tabular-nums (monospaced figures). @default true */
  mono?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Compact statistic tile - "LABEL" on top, bold value below, optional caption.
 *
 * Designed for score/result grids (Time · Moves · Score), dashboards, and
 * social-share cards. Stays visually consistent with `Card` content density.
 * Spacing comes from `theme.components.statTile`.
 *
 * @example
 * ```tsx
 * <StatTile label="TIME" value="01:24" />
 * <StatTile label="BEST" value="358" caption="new record" tone="success" />
 * ```
 */
export function StatTile({
  label,
  value,
  caption,
  tone = 'neutral',
  size = 'md',
  align = 'center',
  mono = true,
  style,
  testID,
}: StatTileProps) {
  const { labels } = useTheme();
  const alignItems = align === 'center' ? 'center' : 'flex-start';

  return (
    <View
      style={[styles.container, { alignItems }, style]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={labels.statValue(label, typeof value === 'string' ? value : '')}
    >
      <Text variant="overline" color="textTertiary">
        {label}
      </Text>
      <StatTileValue value={value} tone={tone} size={size} mono={mono} />
      {caption ? <StatTileCaption caption={caption} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },
});
