import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { useListSectionContext } from './ListSection';

export interface ListItemProps {
  /** Primary label text. */
  title: string;
  /** Secondary descriptive text displayed below the title. */
  subtitle?: string;
  /** Tertiary value string shown on the right side (e.g. a count or date). */
  value?: string;
  /** Leading icon element (emoji string, `<Icon />`, etc.) rendered before the title. */
  icon?: React.ReactNode;
  /**
   * Render prop alternative to `icon`. Takes priority over `icon` when both are provided.
   * @example
   * ```tsx
   * <ListItem title="Profile" renderIcon={() => <Avatar size="sm" />} />
   * ```
   */
  renderIcon?: () => React.ReactNode;
  /** Custom trailing element on the right side (e.g. `Switch`, `Badge`). Replaces the default chevron. */
  trailing?: React.ReactNode;
  /**
   * Render prop alternative to `trailing`. Takes priority over `trailing` when both are provided.
   * @example
   * ```tsx
   * <ListItem title="Volume" renderTrailing={() => <Slider value={vol} />} />
   * ```
   */
  renderTrailing?: () => React.ReactNode;
  /**
   * Whether to display a disclosure chevron on the right.
   * @default true when `onPress` is provided and no `trailing` element exists
   */
  showChevron?: boolean;
  /**
   * Applies destructive (red) text color to the title.
   * @default false
   */
  destructive?: boolean;
  /**
   * When `true`, dims the row and disables press interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * When `true`, omits the bottom margin on the self-contained card so the next
   * row butts against it. No-op inside a grouped `ListSection`.
   * @default false
   */
  omitSpacing?: boolean;
  /**
   * When `true` and rendered inside a grouped `ListSection`, the hairline
   * divider drawn *after* this row is suppressed. No-op outside a grouped
   * section.
   * @default false
   */
  hideDivider?: boolean;
  /** Tap handler - when provided the row becomes a `TouchableOpacity`. */
  onPress?: () => void;
  /**
   * Render prop for a custom chevron element. Falls back to the default
   * `›` glyph when not provided. Use this to inject a Lucide `ChevronRight`
   * (or any custom icon) while keeping the row layout intact.
   */
  renderChevron?: () => React.ReactNode;
  /** Additional styles applied to the row container. */
  style?: ViewStyle;
}

/**
 * Configurable list row for settings screens, menus, and data lists.
 * Supports leading icon, subtitle, trailing value or element, and a
 * disclosure chevron that appears automatically for pressable rows.
 *
 * Accepts render props (`renderIcon`, `renderTrailing`) as alternatives to
 * the static `icon` and `trailing` props. Render props take priority when both
 * are provided.
 *
 * @example
 * ```tsx
 * <ListItem title="Notifications" icon="🔔" onPress={openNotifs} />
 * <ListItem title="Dark Mode" trailing={<Switch value={dark} />} />
 * <ListItem title="Delete Account" destructive onPress={confirmDelete} />
 * <ListItem title="Profile" renderIcon={() => <Avatar size="sm" />} />
 * ```
 */
export function ListItem({
  title,
  subtitle,
  value,
  icon,
  renderIcon,
  trailing,
  renderTrailing,
  showChevron,
  destructive = false,
  disabled = false,
  omitSpacing = false,
  hideDivider: _hideDivider,
  onPress,
  renderChevron,
  style,
}: ListItemProps) {
  const theme = useTheme();
  const { grouped } = useListSectionContext();

  const resolvedIcon = renderIcon ? renderIcon() : icon;
  const resolvedTrailing = renderTrailing ? renderTrailing() : trailing;

  const shouldShowChevron = showChevron ?? (onPress !== undefined && !resolvedTrailing);

  const content = (
    <View
      style={[
        styles.row,
        grouped
          ? {
              paddingVertical: theme.spacing.sm,
              gap: theme.spacing.md,
            }
          : {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.md,
              marginBottom: omitSpacing ? 0 : theme.spacing.sm,
              gap: theme.spacing.md,
            },
        style,
      ]}
    >
      {resolvedIcon && <View style={styles.iconContainer}>{resolvedIcon}</View>}
      <View style={styles.labelContainer}>
        <Text
          style={[
            theme.typography.body,
            {
              color: destructive ? theme.colors.error : theme.colors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[theme.typography.bodySmall, { color: theme.colors.textTertiary, marginTop: 2 }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.right}>
        {value && (
          <Text
            style={[
              theme.typography.bodySmall,
              {
                color: theme.colors.textTertiary,
                marginRight: shouldShowChevron ? 4 : 0,
              },
            ]}
            numberOfLines={1}
          >
            {value}
          </Text>
        )}
        {resolvedTrailing}
        {shouldShowChevron &&
          (renderChevron ? (
            renderChevron()
          ) : (
            <Text
              style={{
                color: theme.colors.textTertiary,
                fontSize: 20,
                fontWeight: '300',
                lineHeight: 22,
              }}
            >
              ›
            </Text>
          ))}
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={theme.opacity.inactive}
        hitSlop={{ top: 2, bottom: 2, left: 0, right: 0 }}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={disabled ? { opacity: theme.opacity.disabled } : undefined}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
