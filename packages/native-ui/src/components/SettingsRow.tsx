import type React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ListItem } from './ListItem';
import { ListSwitchItem } from './ListSwitchItem';
import type { IconSlot } from '../primitives/iconSlot';
import { SettingsIcon } from './settingsRow/SettingsIcon';

export interface SettingsRowProps {
  /** Primary label displayed in the row. */
  label: string;
  /** Secondary descriptive text displayed below the label. */
  subtitle?: string;
  /** Tertiary value string shown on the right side (e.g. a count or date). */
  value?: string;
  /**
   * Icon rendered inside a rounded square. Prefer a render function: it
   * receives `onPrimary` (drawn on a solid `primary` square, or `errorText`
   * on `errorLight` when destructive) and `settingsRow.iconSize`:
   * `icon={({ color, size }) => <SystemIcon name="search" color={color} size={size} />}`.
   * Emoji strings are kept for backwards compatibility and keep their tint
   * from the emoji color map.
   */
  icon?: IconSlot;
  /** Tap handler. */
  onPress?: () => void;
  /** Custom trailing element (replaces the default chevron). */
  rightElement?: React.ReactNode;
  /** Whether to display a disclosure chevron. */
  showChevron?: boolean;
  /** Applies destructive (red) styling to the row. */
  destructive?: boolean;
  /** Dims the row and disables interaction. */
  disabled?: boolean;
  /** Hides the bottom divider (use on the last row in a section). */
  isLast?: boolean;
  /** Additional styles applied to the row container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the row's outermost element. */
  testID?: string;
  /**
   * Custom emoji → background-color mapping merged on top of
   * `theme.components.settingsRow.iconColors`. Values should be opaque hex
   * colors (e.g. `'#3B82F6'`).
   */
  iconColorMap?: Record<string, string>;
  /**
   * Render prop for a vector icon (e.g. Lucide `<Palette/>`). When provided,
   * the `icon` emoji prop is ignored and the stroke icon is rendered inline
   * with the row label (no tinted square background).
   */
  renderIcon?: () => React.ReactNode;
  /** Optional custom chevron renderer (e.g. Lucide `<ChevronRight/>`). */
  renderChevron?: () => React.ReactNode;
}

/**
 * High-level settings list row that wraps {@link ListItem} with a squared icon.
 *
 * @example
 * ```tsx
 * <SettingsRow
 *   label="Search"
 *   icon={({ color, size }) => <SystemIcon name="search" color={color} size={size} />}
 *   onPress={openSearch}
 * />
 * <SettingsRow label="Categories" icon="📁" onPress={openCategories} />
 * <SettingsRow label="Delete" icon="🗑️" destructive onPress={confirmDelete} />
 * ```
 */
export function SettingsRow({
  label,
  icon,
  rightElement,
  destructive,
  isLast,
  iconColorMap,
  renderIcon,
  ...rowProps
}: SettingsRowProps) {
  return (
    <ListItem
      {...rowProps}
      title={label}
      icon={
        renderIcon ? undefined : icon ? (
          <SettingsIcon icon={icon} destructive={destructive} iconColorMap={iconColorMap} />
        ) : undefined
      }
      renderIcon={renderIcon}
      trailing={rightElement}
      destructive={destructive}
      omitSpacing={isLast}
    />
  );
}

export interface SettingsSwitchRowProps {
  /** Primary label displayed in the row. */
  label: string;
  /** Secondary descriptive text displayed below the label. */
  subtitle?: string;
  /**
   * Icon rendered inside a rounded square. Prefer a render function: it
   * receives `onPrimary` (drawn on a solid `primary` square, or `errorText`
   * on `errorLight` when destructive) and `settingsRow.iconSize`:
   * `icon={({ color, size }) => <SystemIcon name="search" color={color} size={size} />}`.
   * Emoji strings are kept for backwards compatibility and keep their tint
   * from the emoji color map.
   */
  icon?: IconSlot;
  /** Current toggle value. */
  value: boolean;
  /** Called when the switch is toggled. */
  onValueChange: (value: boolean) => void;
  /** Hides the bottom divider (use on the last row in a section). */
  isLast?: boolean;
  /**
   * Custom emoji → background-color mapping merged on top of
   * `theme.components.settingsRow.iconColors`. Values should be opaque hex
   * colors (e.g. `'#3B82F6'`).
   */
  iconColorMap?: Record<string, string>;
  /** Render prop for a vector icon (replaces the emoji tint box). */
  renderIcon?: () => React.ReactNode;
  /** Additional styles applied to the row container. */
  style?: StyleProp<ViewStyle>;
  /** Test ID forwarded to the row's outermost element. */
  testID?: string;
}

/**
 * High-level settings row with an integrated switch toggle.
 * Wraps {@link ListSwitchItem} with the same squared icon as {@link SettingsRow}.
 *
 * @example
 * ```tsx
 * <SettingsSwitchRow
 *   label="Dark Mode"
 *   icon="🌙"
 *   value={isDark}
 *   onValueChange={setDark}
 * />
 * ```
 */
export function SettingsSwitchRow({
  icon,
  isLast,
  iconColorMap,
  renderIcon,
  ...switchProps
}: SettingsSwitchRowProps) {
  return (
    <ListSwitchItem
      {...switchProps}
      icon={
        renderIcon ? (
          renderIcon()
        ) : icon ? (
          <SettingsIcon icon={icon} iconColorMap={iconColorMap} />
        ) : undefined
      }
      omitSpacing={isLast}
    />
  );
}
