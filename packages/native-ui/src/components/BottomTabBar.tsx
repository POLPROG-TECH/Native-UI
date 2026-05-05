import React, { useCallback, useMemo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from '../primitives';
import { useTheme } from '../theme';

export interface BottomTabBarItem {
  /** Stable key identifying the tab. */
  readonly key: string;
  /** Display label rendered under the icon. */
  readonly label: string;
  /**
   * Icon renderer. Receives `color` & `size` so the consumer can plug any icon
   * library (lucide, react-native-vector-icons, custom SVG) without the design
   * system taking a hard dependency on a specific icon lib.
   */
  readonly icon: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
  /** Optional accessibility label; defaults to `label`. */
  readonly accessibilityLabel?: string;
  /** Optional badge count / text - renders a small dot-pill on the icon. */
  readonly badge?: number | string;
}

export interface BottomTabBarProps {
  readonly items: readonly BottomTabBarItem[];
  readonly activeKey: string;
  readonly onSelect: (key: string) => void;
  /** Bottom safe-area inset (e.g. from `useSafeAreaInsets().bottom`). */
  readonly safeBottomInset?: number;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

const ICON_SIZE = 22;
const MAX_NUMERIC_BADGE = 99;
const HIT_SLOP = 8;
const IOS_BOTTOM_PAD = 4;
const ANDROID_BOTTOM_PAD = 8;
const PRESSED_OPACITY = 0.7;

/**
 * Opinionated bottom navigation bar modelled 1:1 on DailyForma's tab rail.
 *
 * Layout rules (match reference app exactly):
 *   • Surface = `colors.surface` (not `background`) - sits visually above canvas.
 *   • Top border hairline with `colors.border` (subtle).
 *   • Active = `colors.primary`, Inactive = `colors.textTertiary` (not secondary).
 *   • Icon size 22, label below with `marginTop: 1`, `fontSize: 10`, medium weight.
 *   • Vertical paddings: 4 top, 4 (iOS) / 8 (Android) bottom PLUS safe-area inset.
 *   • 44 px min item tap target.
 */
export function BottomTabBar({
  items,
  activeKey,
  onSelect,
  safeBottomInset = 0,
  style,
  testID,
}: BottomTabBarProps) {
  const theme = useTheme();
  const basePad = Platform.OS === 'ios' ? IOS_BOTTOM_PAD : ANDROID_BOTTOM_PAD;
  const containerStyle = [
    styles.bar,
    {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
      paddingBottom: basePad + safeBottomInset,
    },
    style,
  ];

  return (
    <View testID={testID} style={containerStyle} accessibilityRole="tablist">
      {items.map((item) => (
        <TabItem key={item.key} item={item} focused={item.key === activeKey} onSelect={onSelect} />
      ))}
    </View>
  );
}

// --- TabItem ---

interface TabItemProps {
  readonly item: BottomTabBarItem;
  readonly focused: boolean;
  readonly onSelect: (key: string) => void;
}

const TabItem = React.memo(function TabItem({ item, focused, onSelect }: TabItemProps) {
  const theme = useTheme();
  const tint = focused ? theme.colors.primary : theme.colors.textTertiary;

  const handlePress = useCallback(() => onSelect(item.key), [item.key, onSelect]);
  const pressableStyle = useCallback(
    ({ pressed }: { pressed: boolean }) => [styles.item, pressed && pressedOverlay],
    [],
  );

  const labelStyle = useMemo(
    () => [
      styles.label,
      {
        color: tint,
        fontFamily: theme.fontFamilies?.medium,
      },
    ],
    [tint, theme.fontFamilies?.medium],
  );

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="tab"
      accessibilityLabel={item.accessibilityLabel ?? item.label}
      accessibilityState={{ selected: focused }}
      style={pressableStyle}
      hitSlop={HIT_SLOP}
    >
      <View style={styles.iconWrap}>
        {item.icon({ color: tint, size: ICON_SIZE, focused })}
        {shouldRenderBadge(item.badge) && (
          <TabBadge
            badge={item.badge!}
            color={theme.colors.primary}
            textColor={theme.colors.background}
          />
        )}
      </View>
      <Text numberOfLines={1} style={labelStyle}>
        {item.label}
      </Text>
    </Pressable>
  );
});

// --- TabBadge ---

interface TabBadgeProps {
  readonly badge: number | string;
  readonly color: string;
  readonly textColor: string;
}

const TabBadge = React.memo(function TabBadge({ badge, color, textColor }: TabBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{formatBadge(badge)}</Text>
    </View>
  );
});

// --- Helpers ---

/**
 * Whether a tab badge should render. Hides `null` / `undefined` (no badge),
 * numeric `0` and negatives (common "no unread" state - mirrors `Badge.hideZero`),
 * and empty strings.
 */
function shouldRenderBadge(badge: BottomTabBarItem['badge']): boolean {
  if (badge == null) return false;

  if (typeof badge === 'number') return badge > 0;

  return badge.length > 0;
}

function formatBadge(badge: number | string): string {
  if (typeof badge === 'number' && badge > MAX_NUMERIC_BADGE) return `${MAX_NUMERIC_BADGE}+`;

  return String(badge);
}

// --- Styles ---

const pressedOverlay = { opacity: PRESSED_OPACITY } as const;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 44,
  },
  iconWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 0.1,
  },
});
