import React from 'react';
import { View, Text, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { IconButton } from './IconButton';

export interface HeaderBarProps {
  /** Title shown centered between the back button and the right slot. */
  title?: string;
  /**
   * Render prop for a custom centered title node (e.g. a brand wordmark/logo).
   * When provided, takes precedence over `title`. The `title` string remains
   * available for fallback accessibility purposes.
   *
   * @example
   * ```tsx
   * <HeaderBar renderTitle={() => <BrandWordmark fontSize={22} />} />
   * ```
   */
  renderTitle?: () => React.ReactNode;
  /**
   * Back-button handler. The back button is only rendered if this is
   * provided. Omit it on root screens to render just a right-aligned
   * header without any left action.
   */
  onBack?: () => void;
  /** Accessibility label for the back button. Defaults to "Go back". */
  backAccessibilityLabel?: string;
  /** Test ID for the back button. */
  backTestID?: string;
  /**
   * Custom icon for the back button. Receives theme-aware `color` + `size`
   * so callers can stay consistent. If omitted, a simple chevron glyph is
   * rendered (consumers are encouraged to pass their preferred icon).
   */
  renderBackIcon?: (props: { size: number; color: string }) => React.ReactNode;
  /** Optional node rendered on the right side (e.g. a share `IconButton`). */
  right?: React.ReactNode;
  /**
   * When `true`, reserves the right-slot width even when `right` is not
   * provided. Keeps the title visually centered. Defaults to `true`.
   */
  symmetric?: boolean;
  style?: ViewStyle;
}

/**
 * Screen header: round back `IconButton` on the left, centered title,
 * optional right slot. Framework-agnostic - wire up navigation in the consumer.
 *
 * Use `renderTitle` to drop in a custom node (e.g. a brand wordmark) in place
 * of the plain-text title.
 */
export function HeaderBar({
  title,
  renderTitle,
  onBack,
  backAccessibilityLabel = 'Go back',
  backTestID,
  renderBackIcon,
  right,
  symmetric = true,
  style,
}: HeaderBarProps) {
  const theme = useTheme();

  const BTN_SIZE = 36;
  const ICON_SIZE = 20;

  const backIcon = renderBackIcon ? (
    renderBackIcon({ size: ICON_SIZE, color: theme.colors.textPrimary })
  ) : (
    <Text
      style={{
        fontSize: ICON_SIZE + 4,
        lineHeight: ICON_SIZE + 4,
        color: theme.colors.textPrimary,
        fontWeight: '600',
      }}
    >
      ‹
    </Text>
  );

  const rightSlot =
    right !== undefined ? (
      right
    ) : symmetric ? (
      <View style={{ width: BTN_SIZE, height: BTN_SIZE }} />
    ) : null;

  const leftSlot = onBack ? (
    <IconButton
      icon={backIcon}
      onPress={onBack}
      accessibilityLabel={backAccessibilityLabel}
      size="md"
      {...(backTestID ? { testID: backTestID } : {})}
    />
  ) : symmetric ? (
    <View style={{ width: BTN_SIZE, height: BTN_SIZE }} />
  ) : null;

  let titleNode: React.ReactNode;
  if (renderTitle) {
    titleNode = (
      <View style={styles.title} accessibilityRole="header" accessibilityLabel={title}>
        {renderTitle()}
      </View>
    );
  } else if (title) {
    titleNode = (
      <Text
        numberOfLines={1}
        style={[theme.typography.title, styles.title, { color: theme.colors.textPrimary }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
    );
  } else {
    titleNode = <View style={styles.title} />;
  }

  return (
    <View style={[styles.container, { marginBottom: theme.spacing.sm }, style]}>
      {leftSlot}

      {titleNode}

      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
});
