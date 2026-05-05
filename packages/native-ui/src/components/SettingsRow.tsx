import React, { useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { useTheme } from '../theme';
import { ListItem } from './ListItem';
import { ListSwitchItem } from './ListSwitchItem';

/**
 * Default mapping from emoji icon to a background tint color.
 * Each value is an opaque hex color; the component appends `'18'` (≈ 9 % alpha)
 * at render time for a subtle tinted background.
 */
const DEFAULT_ICON_COLORS: Record<string, string> = {
  '📁': '#3B82F6',
  '💰': '#10B981',
  '🎨': '#8B5CF6',
  '🌙': '#6366F1',
  '☀️': '#F59E0B',
  '📱': '#64748B',
  '🌐': '#06B6D4',
  '💱': '#F59E0B',
  '📤': '#3B82F6',
  '📥': '#10B981',
  '📄': '#3B82F6',
  '📊': '#8B5CF6',
  ℹ️: '#64748B',
  '🔒': '#10B981',
  '⚠️': '#EF4444',
  '🗑️': '#EF4444',
  '❤️': '#EF4444',
  '📅': '#F59E0B',
};

const FALLBACK_ICON_COLOR = '#64748B';

import { normaliseHex } from '../tokens/colors';

function getIconBg(icon: string | undefined, colorMap: Record<string, string>): string {
  if (!icon) return FALLBACK_ICON_COLOR;

  return colorMap[icon] ?? FALLBACK_ICON_COLOR;
}

/** Returns `color` tinted with the given alpha (0-1), falling back to the color
 *  itself if the input is not a valid hex string. */
function tintColor(color: string, alpha: number): string {
  const hex = normaliseHex(color);
  if (!hex) return color;

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

/** Renders an emoji inside a tinted rounded square. */
function EmojiIcon({
  icon,
  destructive,
  colorMap,
}: {
  icon: string;
  destructive?: boolean;
  colorMap: Record<string, string>;
}) {
  const theme = useTheme();

  return (
    <Box
      radius="sm"
      style={{
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: destructive
          ? theme.colors.errorLight
          : tintColor(getIconBg(icon, colorMap), 0.094),
      }}
    >
      <Text style={{ fontSize: 17 }}>{icon}</Text>
    </Box>
  );
}

// ─── SettingsRow ────────────────────────────────────────────────

export interface SettingsRowProps {
  /** Primary label displayed in the row. */
  label: string;
  /** Secondary descriptive text displayed below the label. */
  subtitle?: string;
  /** Tertiary value string shown on the right side (e.g. a count or date). */
  value?: string;
  /** Emoji string rendered inside a tinted icon square. */
  icon?: string;
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
  style?: ViewStyle;
  /**
   * Custom emoji → background-color mapping merged on top of the built-in
   * defaults. Values should be opaque hex colors (e.g. `'#3B82F6'`).
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
 * High-level settings list row that wraps {@link ListItem} with an emoji icon system.
 *
 * @example
 * ```tsx
 * <SettingsRow label="Categories" icon="📁" onPress={openCategories} />
 * <SettingsRow label="Delete" icon="🗑️" destructive onPress={confirmDelete} />
 * ```
 */
export function SettingsRow({
  label,
  subtitle,
  value,
  icon,
  onPress,
  rightElement,
  showChevron,
  destructive,
  disabled,
  isLast,
  style,
  iconColorMap,
  renderIcon,
  renderChevron,
}: SettingsRowProps) {
  const mergedColorMap = useMemo(
    () => (iconColorMap ? { ...DEFAULT_ICON_COLORS, ...iconColorMap } : DEFAULT_ICON_COLORS),
    [iconColorMap],
  );

  return (
    <ListItem
      title={label}
      subtitle={subtitle}
      value={value}
      icon={
        renderIcon ? undefined : icon ? (
          <EmojiIcon icon={icon} destructive={destructive} colorMap={mergedColorMap} />
        ) : undefined
      }
      renderIcon={renderIcon}
      onPress={onPress}
      trailing={rightElement}
      showChevron={showChevron}
      destructive={destructive}
      disabled={disabled}
      omitSpacing={isLast}
      renderChevron={renderChevron}
      style={style}
    />
  );
}

// ─── SettingsSwitchRow ──────────────────────────────────────────

export interface SettingsSwitchRowProps {
  /** Primary label displayed in the row. */
  label: string;
  /** Secondary descriptive text displayed below the label. */
  subtitle?: string;
  /** Emoji string rendered inside a tinted icon square. */
  icon?: string;
  /** Current toggle value. */
  value: boolean;
  /** Called when the switch is toggled. */
  onValueChange: (value: boolean) => void;
  /** Hides the bottom divider (use on the last row in a section). */
  isLast?: boolean;
  /**
   * Custom emoji → background-color mapping merged on top of the built-in
   * defaults. Values should be opaque hex colors (e.g. `'#3B82F6'`).
   */
  iconColorMap?: Record<string, string>;
  /** Render prop for a vector icon (replaces the emoji tint box). */
  renderIcon?: () => React.ReactNode;
}

/**
 * High-level settings row with an integrated switch toggle.
 * Wraps {@link ListSwitchItem} with the emoji icon system.
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
  label,
  subtitle,
  icon,
  value,
  onValueChange,
  isLast,
  iconColorMap,
  renderIcon,
}: SettingsSwitchRowProps) {
  const mergedColorMap = useMemo(
    () => (iconColorMap ? { ...DEFAULT_ICON_COLORS, ...iconColorMap } : DEFAULT_ICON_COLORS),
    [iconColorMap],
  );

  return (
    <ListSwitchItem
      label={label}
      subtitle={subtitle}
      icon={
        renderIcon ? (
          renderIcon()
        ) : icon ? (
          <EmojiIcon icon={icon} colorMap={mergedColorMap} />
        ) : undefined
      }
      value={value}
      onValueChange={onValueChange}
      omitSpacing={isLast}
    />
  );
}
