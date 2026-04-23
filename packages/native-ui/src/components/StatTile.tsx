import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../primitives/Text';

export type StatTileTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error';
export type StatTileSize = 'sm' | 'md' | 'lg';

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
  style?: ViewStyle;
  testID?: string;
}

/**
 * Compact statistic tile - "LABEL" on top, bold value below, optional caption.
 *
 * Designed for score/result grids (Time · Moves · Score), dashboards, and
 * social-share cards. Stays visually consistent with `Card` content density.
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
  const theme = useTheme();

  const valueColor =
    tone === 'primary'
      ? theme.colors.primary
      : tone === 'success'
      ? theme.colors.success
      : tone === 'warning'
      ? theme.colors.warning
      : tone === 'error'
      ? theme.colors.error
      : theme.colors.textPrimary;

  const valueVariant: 'monoLarge' | 'mono' | 'monoSmall' | 'h2' | 'h3' | 'title' = mono
    ? size === 'lg'
      ? 'monoLarge'
      : size === 'sm'
      ? 'monoSmall'
      : 'mono'
    : size === 'lg'
    ? 'h2'
    : size === 'sm'
    ? 'title'
    : 'h3';

  return (
    <View
      style={[
        styles.container,
        { alignItems: align === 'center' ? 'center' : 'flex-start' },
        style,
      ]}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${typeof value === 'string' ? value : ''}`}
    >
      <Text variant="overline" color="textTertiary">
        {label}
      </Text>
      <Text variant={valueVariant} style={{ color: valueColor, marginTop: theme.spacing['2xs'] }}>
        {value}
      </Text>
      {caption ? (
        <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },
});
