import React from 'react';
import { View, Pressable, Platform, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../primitives';

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
  const mediumFamily = theme.fontFamilies?.medium;
  const bottomPad = (Platform.OS === 'ios' ? 4 : 8) + safeBottomInset;
  return (
    <View
      testID={testID}
      style={[
        styles.bar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: bottomPad,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {items.map(item => {
        const focused = item.key === activeKey;
        const tint = focused ? theme.colors.primary : theme.colors.textTertiary;
        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.accessibilityLabel ?? item.label}
            accessibilityState={{ selected: focused }}
            style={({ pressed }) => [
              styles.item,
              pressed && { opacity: 0.7 },
            ]}
            hitSlop={8}
          >
            <View style={styles.iconWrap}>
              {item.icon({ color: tint, size: 22, focused })}
              {item.badge != null ? (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={{
                      color: theme.colors.background,
                      fontSize: 10,
                      fontWeight: '700',
                      lineHeight: 12,
                    }}
                  >
                    {typeof item.badge === 'number' && item.badge > 99 ? '99+' : String(item.badge)}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: tint,
                fontSize: 10,
                fontFamily: mediumFamily,
                fontWeight: '500',
                marginTop: 1,
                letterSpacing: 0.1,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

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
});
