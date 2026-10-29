import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { IconSlot } from '../../primitives/iconSlot';

export interface ListItemProps {
  /** Primary label text. */
  title: string;
  /** Secondary descriptive text displayed below the title. */
  subtitle?: string;
  /** Tertiary value string shown on the right side (e.g. a count or date). */
  value?: string;
  /**
   * Leading icon rendered before the title. Prefer a render function, which
   * receives the row's icon color (`textSecondary`, `errorText` when
   * destructive) and `theme.components.listItem.iconSize`:
   * `icon={({ color, size }) => <SystemIcon name="info" color={color} size={size} />}`.
   * Nodes render as-is; emoji strings are kept for backwards compatibility
   * but look different on every platform and ignore the theme color.
   */
  icon?: IconSlot;
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
  /**
   * Tap handler - when provided the row becomes a `TouchableOpacity` with a
   * themed keyboard focus ring.
   */
  onPress?: () => void;
  /**
   * Render prop for a custom chevron element. Falls back to the default
   * drawn `chevronRight` icon when not provided. Use this to inject a Lucide `ChevronRight`
   * (or any custom icon) while keeping the row layout intact.
   */
  renderChevron?: () => React.ReactNode;
  /** Additional styles applied to the row container. */
  style?: StyleProp<ViewStyle>;
  /**
   * Test ID forwarded to the outermost element. The default chevron gets
   * `${testID}-chevron`.
   */
  testID?: string;
}
