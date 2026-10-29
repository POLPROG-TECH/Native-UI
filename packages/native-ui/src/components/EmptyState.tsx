import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import type { IconSlot } from '../primitives/iconSlot';
import type { TypographyVariant } from '../tokens/typography';
import type { EmptyStateSize, EmptyStateSizeTokens } from '../tokens/components';
import { EmptyStateIcon, EmptyStateMessage, EmptyStateTitle } from './emptyState/EmptyStateParts';

export type { EmptyStateSize };

export interface EmptyStateProps {
  /**
   * Leading visual rendered above the title. Prefer a render function, which
   * receives `textSecondary` and the size preset's `iconSize`:
   * `icon={({ color, size }) => <SystemIcon name="search" color={color} size={size} />}`.
   * Nodes render as-is; emoji strings are kept for backwards compatibility
   * and use `iconSize` as their font size.
   */
  icon?: IconSlot;
  /** Primary heading text. */
  title: string;
  /** Optional descriptive message rendered below the title. */
  message?: string;
  /** Action element (e.g. a `<Button />`) rendered below the message. */
  action?: React.ReactNode;
  /**
   * Density preset: `sm` for inline / list placeholders, `md` (default) for
   * screens, `lg` for onboarding-style hero states.
   * @default theme.components.emptyState.defaultSize ('md')
   */
  size?: EmptyStateSize;
  /** Overrides the size preset's title typography. */
  titleVariant?: TypographyVariant;
  /** Overrides the size preset's message typography. */
  messageVariant?: TypographyVariant;
  /**
   * Grow to fill the parent (`flex: 1`). Disable inside a list's
   * `ListEmptyComponent`, where flex growth has no bounded parent.
   * @default true
   */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function presetPadding(preset: EmptyStateSizeTokens): ViewStyle {
  return { paddingHorizontal: preset.paddingHorizontal, paddingVertical: preset.paddingVertical };
}

/**
 * Centered empty/zero-state placeholder with icon, title, message, and
 * optional action. Use inside scrollable containers or full-screen views
 * when there is no data to display. Spacing and type come from
 * `theme.components.emptyState[size]`.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={({ color, size }) => <SystemIcon name="search" color={color} size={size} />}
 *   title="No messages"
 *   message="You're all caught up!"
 *   action={<Button title="Refresh" onPress={refresh} />}
 * />
 * <EmptyState size="sm" fill={false} title="No results" />
 * ```
 */
export function EmptyState({
  icon,
  title,
  message,
  action,
  size,
  titleVariant,
  messageVariant,
  fill = true,
  style,
  testID,
}: EmptyStateProps) {
  const tokens = useTheme().components.emptyState;
  const preset = tokens[size ?? tokens.defaultSize];

  return (
    <View
      testID={testID}
      style={[styles.container, fill && styles.fill, presetPadding(preset), style]}
      accessibilityRole="summary"
    >
      <EmptyStateIcon icon={icon} preset={preset} />
      <EmptyStateTitle text={title} variant={titleVariant} preset={preset} />
      {message && <EmptyStateMessage text={message} variant={messageVariant} preset={preset} />}
      {action && <View style={{ marginTop: preset.actionMarginTop }}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
  },
});
